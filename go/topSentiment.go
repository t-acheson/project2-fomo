package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	_ "github.com/lib/pq" // PostgreSQL driver
)

var db *sql.DB

// getOverallSentiment calculates the average sentiment score of comments within a 2km radius of the given latitude and longitude.
func getOverallSentiment(lat float64, lng float64) (float64, error) {
	rows, err := db.Query(`
		SELECT sentiment 
		FROM comments 
		WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), 2000)`,
		lat, lng)
	if err != nil {
		fmt.Println("Error retrieving comments:", err)
		return 0, err
	}
	defer rows.Close()

	var totalSentiment int
	var count int

	for rows.Next() {
		var sentiment int
		if err := rows.Scan(&sentiment); err != nil {
			fmt.Println("Error scanning sentiment:", err)
			return 0, err
		}
		totalSentiment += sentiment
		count++
	}

	if err := rows.Err(); err != nil {
		fmt.Println("Error with rows:", err)
		return 0, err
	}

	if count == 0 {
		return 0, nil // No comments in range
	}

	averageSentiment := float64(totalSentiment) / float64(count)
	return averageSentiment, nil
}

// sentimentHandler handles requests to calculate the overall sentiment score within a 2km radius of the clicked location.
func sentimentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var requestBody struct {
		Lat float64 `json:"lat"`
		Lng float64 `json:"lng"`
	}

	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	sentiment, err := getOverallSentiment(requestBody.Lat, requestBody.Lng)
	if err != nil {
		http.Error(w, "Error calculating sentiment", http.StatusInternalServerError)
		return
	}

	response := map[string]float64{"sentiment": sentiment}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	http.HandleFunc("/sentiment", sentimentHandler)
	fmt.Println("Sentiment server listening on port 8081")
	http.ListenAndServe(":8081", nil)
}
