package main

import (
	"fmt" //Formatted I/O
	"log" //Logging errors
	"net/http" //HTTP server
	"time" //Used for time.Sleep
	"encoding/json"
	"regexp"
	"database/sql"
	pb "project2-fomo/go/go/busyness"
	"google.golang.org/grpc"
	"context"
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
 
func locationHandler(w http.ResponseWriter, r *http.Request) {
    // Log that a request has been received at the "/location" endpoint
    log.Println("Received request at /location endpoint")

    // Decode the request body into a LocationRequest struct
    var locReq LocationRequest
    err := json.NewDecoder(r.Body).Decode(&locReq)
    if err != nil {
        // If there is an error decoding the request body, return a bad request error
        http.Error(w, err.Error(), http.StatusBadRequest)
        log.Println("Error decoding request body:", err)
        return
    }

    log.Printf("Location ID: %d\n", locReq.LocationID)

	// Connect to the gRPC server
	conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
	if err != nil {
		log.Println("Failed to connect to gRPC server:", err)
		http.Error(w, "Failed to connect to gRPC server", http.StatusInternalServerError)
		return
	}
	defer conn.Close()

	client := pb.NewBusynessPredictorClient(conn)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	resp, err := client.PredictBusyness(ctx, &pb.BusynessRequest{LocationId: int32(locReq.LocationID)})
	if err != nil {
		log.Println("Error calling gRPC service:", err)
		http.Error(w, "Error calling gRPC service", http.StatusInternalServerError)
		return
	}

    // Prepare the response data
    responseData := map[string]interface{}{
		"location_id": locReq.LocationID,
		"busyness":    resp.Busyness,
		"message":     "API call successful",
	}

    // Set the response headers
    w.Header().Set("Content-Type", "application/json")

    // Encode the response data as JSON and write it to the response writer
    err = json.NewEncoder(w).Encode(responseData)
    if err != nil {
        log.Println("Error encoding response:", err)
        http.Error(w, "Internal server error", http.StatusInternalServerError)
        return
    }
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
	// go func() {
	// 	log.Printf("Starting HTTPS listener")
	// 	// domain := os.Getenv("DOMAIN_NAME")
	// 	err := http.ListenAndServeTLS(":443", "/etc/letsencrypt/live/nycfomo.com/fullchain.pem", "/etc/letsencrypt/live/nycfomo.com/privkey.pem", nil)
	// 	if err != nil {
	// 		log.Fatalf("HTTPS server failed to start: %v", err)
	// 	}
	// }()

	//Start HTTP listener on port 80
	log.Printf("Starting HTTP listener")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
