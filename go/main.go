package main

import (
	"encoding/json" //JSON encoding and decoding
	"fmt"           //Formatted I/O
	"log"           //Logging errors
	"net/http"      //HTTP server
	"os"            //Pass in environment vars
	"golang.org/x/net/websocket"
	"regexp"
	"time"          //Used for time.Sleep

	//"github.com/gorilla/sessions" //Session management
	"database/sql"
	"github.com/rs/cors"
)

// Struct to hold user session data
type User struct {
	UserID string
}

// Item represents a generic item in our API
type Item struct {
    ID    string `json:"id"`
    Name  string `json:"name"`
}

// items slice to seed item record data.
var items = []Item{
    {ID: "1", Name: "Item One"},
    {ID: "2", Name: "Item Two"},
}

func getItems(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(items)
}

// Define a global session store
//var store = sessions.NewCookieStore([]byte("sampleKey"))

// Define a connection the the Postgres db
var db *sql.DB

func handler(w http.ResponseWriter, _ *http.Request) {
	//Writes a response to a HTTP request to the HTTP response writer, w.
	fmt.Fprintf(w, "Go server running")
}

//Redirect HTTP request to HTTPS
func redirectHTTP(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://"+r.Host+r.URL.String(), http.StatusMovedPermanently)
}
// Handler for the root path
func rootHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Go server running at root")
}

func main() {
    mux := http.NewServeMux()
	 // Register the root handler
	 mux.HandleFunc("/", rootHandler)
	 // Register the /items handler
    mux.HandleFunc("/items", getItems)

	// Setup CORS
    handler := cors.Default().Handler(mux)

    // Start the server on localhost:8080
    log.Println("Server starting on port 8080...")
    if err := http.ListenAndServe(":8080", handler); err != nil {
        log.Fatalf("Error starting server: %s\n", err)
    }
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

	server := NewServer()
	http.Handle("/ws", websocket.Handler(server.handleWebSocket))
	// Perform a type assertion to convert handler to http.HandlerFunc

	// Check if handler is an http.HandlerFunc old func caqrried through
_, ok := handler.(http.HandlerFunc)
if !ok {
	// handler is not an http.HandlerFunc, handle the error
	log.Fatal("handler is not an http.HandlerFunc")
}

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
