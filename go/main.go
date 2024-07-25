package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"
	"golang.org/x/net/websocket"
	// "github.com/google/uuid"
	"database/sql"
)

// Define a connection the the Postgres db
var db *sql.DB

var busynessMap map[string]float32

//Redirect HTTP request to HTTPS
func redirectHTTP(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://"+r.Host+r.URL.String(), http.StatusMovedPermanently)
}

// CORS middleware function
func CORSMiddleware(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*") // Allow all origins
		w.Header().Set("Access-Control-Allow-Methods", "POST") // Allow specific methods
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type") // Allow specific headers

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the actual handler
		h(w, r)
	}
} 
// Handles HTTP request at the "/location" endpoint.
// Decodes the request body, calls the grpc server and encodes response as JSON
func locationHandler(w http.ResponseWriter, r *http.Request) {
	// Log that a request has been received at the "/location" endpoint
	log.Println("Received request at /location endpoint")

	w.Header().Set("Content-Type", "application/json")

	// Code for turning the map to json
	jsonBusyness, err := json.Marshal(busynessMap)
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	
	// Write JSON to response
	_, err = w.Write(jsonBusyness)
	if err != nil {
		fmt.Println("Error writing response:", err)
	}
}

func main() {
	//Connects to Postgres/PostGIS db
	db = connectToPostgres()
	defer db.Close()

	// Generate busyness values initially
	cacheBusyness()

	// Run the crontab for archiving comments and updating busyness
	runCron()

	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Define the file server for static files
		fs := http.FileServer(http.Dir("frontendreact/build"))
		// Define the regex pattern to match file extensions
		fileMatcher := regexp.MustCompile(`\.[a-zA-Z]*$`)
		if !fileMatcher.MatchString(r.URL.Path) {
			http.ServeFile(w, r, "frontendreact/build/index.html")
		} else {
			fs.ServeHTTP(w, r)
		}
	}))

	// location handler
	http.HandleFunc("/location", CORSMiddleware(locationHandler))
	log.Println("Location handler is set up")

	// Set up websocket server
	server := NewServer()

	websocketHandler := func(ws *websocket.Conn) {
		// Require an inital message declaring latitude and longitude
		var initialMsg struct {
			Lat float64 `json:"lat"`
			Lng float64 `json:"lng"`
			Fingerprint string `json:"fingerprint"`
		}

		if err := websocket.JSON.Receive(ws, &initialMsg); err != nil {
			fmt.Println("Error receving inital message with lat/lng:",err)
			return
		}

		// Call handleWebSocket with conn and lat/lng
		server.handleWebSocket(ws, initialMsg.Lat, initialMsg.Lng, initialMsg.Fingerprint)
	}

	http.Handle("/ws", websocket.Handler(websocketHandler))


	//handler for top comment functions 
	http.HandleFunc("/topcomment", CORSMiddleware(func(w http.ResponseWriter, r *http.Request) {
		// Log that a request has been received at the "/topcomment" endpoint
		log.Println("Received request at /topcomment endpoint")
		var params struct {
			Lat float64 `json:"lat"`
			Lng float64 `json:"lng"`
		}
		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		topComment, err := getTopCommentFunc(params.Lat, params.Lng)
		if err != nil {
			http.Error(w, "Error getting Top Comment", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(topComment); err != nil {
			http.Error(w, "Error encoding top comment response", http.StatusInternalServerError)
			return
		}
	}))



	//Start TLS listener on port 443
	go func() {
		log.Printf("Starting HTTPS listener")
		domain := os.Getenv("DOMAIN_NAME")
		err := http.ListenAndServeTLS(":443", "/etc/letsencrypt/live/"+domain+"/fullchain.pem", "/etc/letsencrypt/live/"+domain+"/privkey.pem", nil)
		if err != nil {
			log.Fatalf("HTTPS server failed to start: %v", err)
		}
	}()

	//Start HTTP listener on port 80
	log.Printf("Starting HTTP listener")
	log.Fatal(http.ListenAndServe(":80", http.HandlerFunc(redirectHTTP)))
}
