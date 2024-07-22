package main

import (
	// "database/sql"
	"fmt"

	// "github.com/google/uuid"
	// "golang.org/x/net/websocket"
	// // "time"
)

// // comment structure.
// type Comment struct {
// 	ID        int       `json:"id"`
// 	ParentID  *int      `json:"parentid,omitempty"`
// 	Text      string    `json:"text"`
// 	Likes     int       `json:"likes"`
// 	Dislikes  int       `json:"dislikes"`
// 	Timestamp time.Time `json:"timestamp"`
// }

// Server represents the server with a connection map.
// type Server struct {
// 	conns map[uuid.UUID]*websocket.Conn
// }

// getTopComment retrieves the comment with the highest number of likes within a 2km radius of the given latitude and longitude.
// If there are multiple comments with the same number of likes, it returns the most recent one.
func (s *Server) getTopComment(lat float64, lng float64) (*Comment, error) {
	var topComment Comment
	err := db.QueryRow(`
		SELECT id, parent_id, text, likes, dislikes, timestamp 
		FROM comments 
		WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), 2000)
		ORDER BY likes DESC, timestamp DESC
		LIMIT 1`,
		lat, lng).Scan(&topComment.ID, &topComment.ParentID, &topComment.Text, &topComment.Likes, &topComment.Dislikes, &topComment.Timestamp)
	if err != nil {
		fmt.Println("Error retrieving top comment from database:", err)
		return nil, err
	}
	return &topComment, nil
}