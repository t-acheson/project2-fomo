package main

import (
	"fmt"      //Formatted I/O
	"log"      //Logging errors
	"net/http" //HTTP server

	"github.com/gorilla/sessions" //Session management
)

// Struct to hold user session data
type User struct {
	UserID
}

// Define a global session store
var store = sessions.NewCookieStore([]byte("sampleKey"))

func handler(w http.ResponseWriter, r *http.Request) {
	//Writes a response to a HTTP request to the HTTP response writer, w.
	fmt.Fprintf(w, "Go server running")
}

func main() {
	//Test the gRPC server
	testRecommend()

	//Set up HTTP handler at root URL
	http.HandleFunc("/", handler)
	//Start HTTP server on port 80. If server fails to start, log fatal error
	log.Fatal(http.ListenAndServe(":80", nil))
}
