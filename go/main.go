package main

import (
	"fmt"      //Formatted I/O
	"log"      //Logging errors
	"net/http" //HTTP server
	"time" //Used for time.Sleep
	"os" //Pass in environment vars
	"golang.org/x/net/websocket"
	"regexp"
	"encoding/json"
	//"github.com/gorilla/sessions" //Session management
	"database/sql"
)

// Struct to hold user session data
type User struct {
	UserID string
}

// Define a global session store
//var store = sessions.NewCookieStore([]byte("sampleKey"))

// Define a connection the the Postgres db
var db *sql.DB

func handler(w http.ResponseWriter, r *http.Request) {
	//Writes a response to a HTTP request to the HTTP response writer, w.
	fmt.Fprintf(w, "Go server running")
}

//Redirect HTTP request to HTTPS
func redirectHTTP(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://"+r.Host+r.URL.String(), http.StatusMovedPermanently)
}

// LocationRequest represents the structure of the incoming request with location ID
type LocationRequest struct {
	LocationID int `json:"location_id"`
}

func locationHandler(w http.ResponseWriter, r *http.Request){
	var loqReq LocationRequest
	err := json.NewDecoder(r.Body).Decode(&loqReq)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Printf("Location ID: %d\n", loqReq.LocationID)

	//TODO use the location ID to query the pickle file here 

	//just for now, send response back 
	response := map[string]string{"status": "received"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}




func main() {
	// Give the gRPC server a second to open
	time.Sleep(1 * time.Second)

	//Test the gRPC server
	testRecommend()

	// Give postgres a few seconds to open
	time.Sleep(5 * time.Second)

	//Connects to Postgres/PostGIS db
	db = connectToPostgres()
	defer db.Close()

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
	http.HandleFunc("/location", locationHandler)


	server := NewServer()
	http.Handle("/ws", websocket.Handler(server.handleWebSocket))

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
	log.Fatal(http.ListenAndServe(":8080", http.HandlerFunc(redirectHTTP)))
}
