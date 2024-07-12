package main

import (
	"fmt"      //Formatted I/O
	"log"      //Logging errors
	"net/http" //HTTP server
	"os/exec"
	"time" //Used for time.Sleep

	// "os" //Pass in environment vars
	// "golang.org/x/net/websocket"
	"encoding/json"
	"regexp"

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
 
// locationHandler handles the HTTP request at the "/location" endpoint.
// It decodes the request body, calls a Python script with the location ID,
// and encodes the response as JSON.
func locationHandler(w http.ResponseWriter, r *http.Request) {
	// Log that a request has been received at the "/location" endpoint
	log.Println("Received request at /location endpoint")

	// Decode the request body into a LocationRequest struct
	var loqReq LocationRequest
	err := json.NewDecoder(r.Body).Decode(&loqReq)
	if err != nil {
		// If there is an error decoding the request body, return a bad request error
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Println("Error decoding request body:", err)
		return
	}

	// Log the location ID received from the request
	log.Printf("Location ID: %d\n", loqReq.LocationID)

	// TODO: use the location ID to query the pickle file here
	// Call the Python script
	cmd := exec.Command("python3", "grpc_model.py", fmt.Sprintf("%d", loqReq.LocationID))
	out, err := cmd.Output()
	if err != nil {
		// If there is an error running the Python script, return an internal server error
		http.Error(w, "Error running Python script", http.StatusInternalServerError)
		log.Println("Error running Python script:", err)
		return
	}

	// Parse the output of the Python script into a map
	var response map[string]string
	err = json.Unmarshal(out, &response)
	if err != nil {
		// If there is an error parsing the Python script output, return an internal server error
		http.Error(w, "Error parsing Python script output", http.StatusInternalServerError)
		log.Println("Error parsing Python script output:", err)
		return
	}

	// Set the response header to indicate that the response is JSON
	w.Header().Set("Content-Type", "application/json")

	// Encode the response as JSON and write it to the response writer
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		log.Println("Error encoding response:", err)
	}

	// Log the response that was sent
	log.Println("Response sent:", response)
}




func main() {
	// Give the gRPC server a second to open
	time.Sleep(1 * time.Second)
	log.Println("Slept for 1 second for gRPC server")

	//Test the gRPC server
	// testRecommend()

	// Give postgres a few seconds to open
	// time.Sleep(5 * time.Second)

	//Connects to Postgres/PostGIS db
	// db = connectToPostgres()
	// defer db.Close()

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
	log.Println("Location handler is set up")


	// server := NewServer()
	// http.Handle("/ws", websocket.Handler(server.handleWebSocket))

	//Start TLS listener on port 443
	go func() {
		log.Printf("Starting HTTPS listener")
		// domain := os.Getenv("DOMAIN_NAME")
		err := http.ListenAndServeTLS(":443", "/etc/letsencrypt/live/nycfomo.com/fullchain.pem", "/etc/letsencrypt/live/nycfomo.com/privkey.pem", nil)
		if err != nil {
			log.Fatalf("HTTPS server failed to start: %v", err)
		}
	}()

	//Start HTTP listener on port 80
	log.Printf("Starting HTTP listener")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
