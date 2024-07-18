package main

import (
	"fmt" //Formatted I/O
	"log"      //Logging errors
	"net/http" //HTTP server
	"os" //Pass in environment vars
	"golang.org/x/net/websocket"
	"encoding/json"
	"regexp"
	"database/sql"
)

// Define a connection the the Postgres db
var db *sql.DB

// Structure of the incoming request of location ID from frontend to be sent to grpc server
type LocationRequest struct {
	LocationID int `json:"location_id"`
}

//Redirect HTTP request to HTTPS
func redirectHTTP(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://"+r.Host+r.URL.String(), http.StatusMovedPermanently)
}
 
// Handles HTTP request at the "/location" endpoint.
// Decodes the request body, calls the grpc server and encodes response as JSON
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

<<<<<<< Updated upstream
	log.Printf("Location ID: %d\n", loqReq.LocationID)
=======
	//Test the gRPC server
	//	testRecommend()
>>>>>>> Stashed changes

	w.Header().Set("Content-Type", "application/json")

	// Contact the grpc server to receieve busyness estimate for locationid
	response := fmt.Sprintf(`{"busyness": "%f"}`, estimateBusyness(loqReq.LocationID))

  // Decode the response string into a map (assuming JSON format)
  var responseMap map[string]interface{}
  err = json.Unmarshal([]byte(response), &responseMap)
  if err != nil {
  	log.Println("Error decoding response:", err)
   	http.Error(w, "Internal server error", http.StatusInternalServerError)
    return
  }

  // Encode the response map as JSON and write it to the response writer
  err = json.NewEncoder(w).Encode(responseMap)
  if err != nil {
  	log.Println("Error encoding response:", err)
  }
}

func main() {
	//Connects to Postgres/PostGIS db
	db = connectToPostgres()
	defer db.Close()

	//Run the crontab for archiving comments
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
	http.HandleFunc("/location", locationHandler)
	log.Println("Location handler is set up")

	// Set up websocket server
	server := NewServer()

	websocketHandler := func(ws *websocket.Conn) {
		// Require an inital message declaring latitude and longitude
		var initialMsg struct {
			Lat float64 `json:"lat"`
			Lng float64 `json:"lng"`
		}

		if err := websocket.JSON.Receive(ws, &initialMsg); err != nil {
			fmt.Println("Error receving inital message with lat/lng:",err)
			return
		}

		// Call handleWebSocket with conn and lat/lng
		server.handleWebSocket(ws, initialMsg.Lat, initialMsg.Lng)
	}

	http.Handle("/ws", websocket.Handler(websocketHandler))

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
