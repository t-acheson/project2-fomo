package main

import (
	"fmt"      //Formatted I/O
	"log"      //Logging errors
	"net/http" //HTTP server
	"time" //Used for time.Sleep
	"os" //Pass in environment vars

	"github.com/gorilla/sessions" //Session management
)

// Struct to hold user session data
type User struct {
	UserID string
}

// Define a global session store
var store = sessions.NewCookieStore([]byte("sampleKey"))

func handler(w http.ResponseWriter, r *http.Request) {
	//Writes a response to a HTTP request to the HTTP response writer, w.
	fmt.Fprintf(w, "Go server running")
}

//Redirect HTTP request to HTTPS
func redirectHTTP(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://"+r.Host+r.URL.String(), http.StatusMovedPermanently)
}

func main() {
	// Give the gRPC server a second to open
	time.Sleep(1 * time.Second)

	//Test the gRPC server
	testRecommend()

	// Give postgres a few seconds to open
	time.Sleep(5 * time.Second)

	//Connects to Postgres/PostGIS db
	db := connectToPostgres()
	defer db.Close()

	//Set up HTTP handler at root URL
	http.HandleFunc("/", handler)

	//Start TLS listener on port 443
	go func() {
		log.Printf("Starting HTTPS listener")
		domain := os.Getenv("DOMAIN_NAME")
		err := http.ListenAndServeTLS(":443", "/etc/letsencrypt/live/"+domain+"/fullchain.pem", "/etc/letsencrypt/live/"+domain+"/privkey.pem", nil)
		if err != nil {
			log.Fatalf("HTTPS server failed to start: %v", err)
		}
	}()

	//Starting websocket chat on port 3000
	go func() {
		log.Printf("Starting websocket chat")
		err := chat()
		if err != nil {
			log.Fatalf("Failed to start the websocket chat: %v", err)
		}
	}

	//Start HTTP listener on port 80
	log.Printf("Starting HTTP listener")
	log.Fatal(http.ListenAndServe(":80", http.HandlerFunc(redirectHTTP))
}
