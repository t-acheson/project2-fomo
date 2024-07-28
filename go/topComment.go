package main

import (
	"database/sql"
	"fmt"
	// "github.com/google/uuid"
	// "golang.org/x/net/websocket"
	"time"
  "github.com/lib/pq"

)

//func for mocking in tests
var getTopCommentFunc = getTopComment

// getTopComment retrieves the comment with the highest number of likes within a 2km radius of the given latitude and longitude.
// If there are multiple comments with the same number of likes, it returns the most recent one.
func getTopComment(lat float64, lng float64) (*Comment, error) {
	var topComment Comment
	var tags []string

	// Get current time in New York
	nyLocation, _ := time.LoadLocation("America/New_York")
	currentTimeNY := time.Now().In(nyLocation)

	// Modified to only get comments from now or earlier
	err := db.QueryRow(`
		SELECT id, parent_id, text, likes, dislikes, timestamp, tags 
		FROM comments 
		WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), 2000)
		AND timestamp <= $3
		ORDER BY likes DESC, timestamp DESC
		LIMIT 1`,
		lat, lng, currentTimeNY).Scan(&topComment.ID, &topComment.ParentID, &topComment.Text, &topComment.Likes, &topComment.Dislikes, &topComment.Timestamp, pq.Array(&tags))
		if err != nil {
			if err == sql.ErrNoRows {
				fmt.Println("No comments found in this area")
				return nil, nil
			}
		fmt.Println("Error retrieving top comment from database:", err)
		return nil, err
	}
	
	// Manually map tags to the Tags struct fields
  if len(tags) > 0 {
    topComment.Tags.Tag1 = tags[0]
  }
  if len(tags) > 1 {
    topComment.Tags.Tag2 = tags[1]
  }
  if len(tags) > 2 {
    topComment.Tags.Tag3 = tags[2]
  }

	return &topComment, nil
}


func getSentiment(lat float64, lng float64) (float64, error) {
	var totalSentiment int
	var commentCount int

	// Get current time in New York
	nyLocation, _ := time.LoadLocation("America/New_York")
	currentTimeNY := time.Now().In(nyLocation)

	// Retrieve comments within 2km radius 
	rows, err := db.Query(`
		SELECT sentiment
		FROM comments 
		WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), 2000)
		AND timestamp <= $3`,
		lat, lng, currentTimeNY)
	if err != nil {
		fmt.Println("Error retrieving comments from database:", err)
		return -1, err
	}
	defer rows.Close()

	// Loop through the retrieved comments to calculate the average sentiment
	for rows.Next() {
		var sentimentScore int
		if err := rows.Scan(&sentimentScore); err != nil {
			fmt.Println("Error scanning comment row:", err)
			continue
		}
		
		totalSentiment += sentimentScore
		commentCount++
	}

	// Calculate the average sentiment score
	var averageSentiment float64
	if commentCount > 0 {
		averageSentiment = float64(totalSentiment) / float64(commentCount)
	} else {
		averageSentiment = 0 
	}

	return averageSentiment, nil
}
