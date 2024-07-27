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
	// Get current time in New York timezone
    nyLocation, err := time.LoadLocation("America/New_York")
    if err != nil {
        fmt.Println("Error loading New York timezone:", err)
        return 0, err
    }
    currentTimeNY := time.Now().In(nyLocation)

	rows, err := db.Query(`
		SELECT sentiment 
		FROM comments 
		WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), 2000)
		AND timestamp <= $3
		`, lat, lng, currentTimeNY)
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
