package main

import (
	"database/sql"
	"fmt"
	// "github.com/google/uuid"
	// "golang.org/x/net/websocket"
	// // "time"
)

//func for mocking in tests
var getTopCommentFunc = getTopComment

// getTopComment retrieves the comment with the highest number of likes within a 2km radius of the given latitude and longitude.
// If there are multiple comments with the same number of likes, it returns the most recent one.
func getTopComment(lat float64, lng float64) (*Comment, error) {
	var topComment Comment
	err := db.QueryRow(`
		SELECT id, parent_id, text, likes, dislikes, timestamp 
		FROM comments 
		WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), 2000)
		ORDER BY likes DESC, timestamp DESC
		LIMIT 1`,
		lat, lng).Scan(&topComment.ID, &topComment.ParentID, &topComment.Text, &topComment.Likes, &topComment.Dislikes, &topComment.Timestamp)
		if err != nil {
			if err == sql.ErrNoRows {
				fmt.Println("No comments found in this area")
				return nil, nil
			}
		fmt.Println("Error retrieving top comment from database:", err)
		return nil, err
	}
	return &topComment, nil
}