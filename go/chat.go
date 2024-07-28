package main

import (
  "golang.org/x/net/websocket"
  //"sync"
  "fmt"
  "io"
  "time"
  "encoding/json"
  "github.com/lib/pq"
)

type Server struct {
  conns map[string]*websocket.Conn // Map of FingerprintJS fingerprint hash to websocket connection
  //mu sync.Mutex
}

type Comment struct {
  ID int `json:"id"`
  ParentID *int `json:"parentid,omitempty"` //Pointer and omitempty to handle the parentid case.
  Text string `json:"text"`
  Likes int `json:"likes"`
  Dislikes int `json:"dislikes"`
  Timestamp time.Time `json:"timestamp"`
  Tags Tags `json:"tags,omitempty"` //If the comment is a reply it doesnt need tags
}

type Tags struct {
  Tag1 string `json:"tag1"`
  Tag2 string `json:"tag2,omitempty"`
  Tag3 string `json:"tag3,omitempty"`
}

type WebsocketMessage struct {
  Type string `json:"type"`
  CommentID int `json:"commentid,omitempty"`
  ParentID *int `json:"parentid,omitempty"`
  Text string `json:"text,omitempty"`
  Like bool `json:"like,omitempty"`
  Dislike bool `json:"dislike,omitempty"`
  Latitude float64 `json:"lat,omitempty"`
  Longitude float64 `json:"lng,omitempty"`
  Tags Tags `json:"tags,omitempty"`
}

type WebsocketReply struct {
  Type string `json:"type"`
  Comment *Comment `json:"comment,omitempty"`
  CommentID int `json:"commentid,omitempty"`
  Likes *int `json:"likes,omitempty"`
  Dislikes *int `json:"dislikes,omitempty"`
}

type History struct {
  Type string `json:"type"`
  Likes []int `json:"likes"`
  Dislikes []int `json:"dislikes"`
}

func NewServer() *Server {
  return &Server {
    conns: make(map[string]*websocket.Conn),
  }
}

var nyc *time.Location

func setTimezone() {
  _, err := db.Exec("SET TIME ZONE 'America/New_York';")
  if err != nil {
    fmt.Println("Error changing the timezone in postgres")
  }

  nyc, err = time.LoadLocation("America/New_York")
	if err != nil {
		fmt.Println("Error loading timezone:", err)
		return
	}
}

func (s *Server) handleWebSocket(ws *websocket.Conn, lat float64, lng float64, fingerprint string) {
  //s.mu.Lock()
  //defer s.mu.Unlock()

  fmt.Println("New incoming connection from client:", ws.RemoteAddr())

  err := ws.SetDeadline(time.Now().Add(60 * time.Second))
	if err != nil {
		fmt.Println("SetDeadline error:", err)
		return
	}

	// A goroutine to handle pings
	go func() {
		for {
			time.Sleep(30 * time.Second)
			if err := websocket.Message.Send(ws, `{"type": "ping"}`); err != nil {
				fmt.Println("Ping error:", err)
				return
			}
		}
	}()

  start := time.Now()
  s.addConnection(fingerprint, lat, lng)
  duration := time.Since(start)
  fmt.Println("Added connection to users table in time:", duration)

  s.conns[fingerprint] = ws

  // Retreive historical messages
  start = time.Now()
  s.retrieve(ws, lat, lng)
  duration = time.Since(start)
  fmt.Println("Retreived historical messages for client in time:", duration)

  // Retrieve their likes/dislikes, if any
  start = time.Now()
  s.retrieveLikes(ws, fingerprint)
  duration = time.Since(start)
  fmt.Println("Retrieved likes/dislikes from the user in time:", duration)
  
  //s.mu.Unlock()
  s.readLoop(ws, fingerprint)
  //s.mu.Lock()

  fmt.Println("Client disconnected at", ws.RemoteAddr())
  start = time.Now()
  err = s.removeConnection(fingerprint)
  if err != nil {
    fmt.Println("Client already removed from database in handleWebSocket:", err)
  }

  delete(s.conns, fingerprint)

  duration = time.Since(start)
  fmt.Println("Removed connection for users table in time:", duration)
}

// Add websocket client to the users table using their lat/lng
func (s *Server) addConnection(fingerprint string, lat float64, lng float64) {
  _, err := db.Exec(`
    INSERT INTO users (fingerprint, location) VALUES
    ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326))
    ON CONFLICT (fingerprint)
    DO UPDATE SET location = EXCLUDED.location;`,
    fingerprint, lat, lng,
  )
  if err != nil {
    fmt.Println("Error writing user to users table:", err)
  }
}

func (s *Server) removeConnection(fingerprint string) error {
  _, err := db.Exec(`
    DELETE FROM users 
    WHERE fingerprint = $1`,
    fingerprint,
  )
  if err != nil {
    fmt.Println("Error removing user from users table:", err)
    return err
  }
  return nil
}

// Select applicable historical comments and iteratively send them to the new client
func (s *Server) retrieve(ws *websocket.Conn, lat float64, lng float64) {
  rows, err := db.Query(`
  SELECT id, parent_id, timestamp, text, likes, dislikes, tags
  FROM comments
  WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), 5000)
    AND timestamp <= $3
  ORDER BY timestamp DESC
  LIMIT 100;`,
  lat, lng, time.Now().In(nyc),
  )
  defer rows.Close()
  
  for rows.Next() {
    var comment Comment
    var tags []string
    if err := rows.Scan(&comment.ID, &comment.ParentID, &comment.Timestamp, &comment.Text, &comment.Likes, &comment.Dislikes, pq.Array(&tags)); err != nil {
      fmt.Println("Error retrieving comment from database:", err)
      continue
    }
    
    // Manually map tags to the Tags struct fields
    if len(tags) > 0 {
      comment.Tags.Tag1 = tags[0]
    }
    if len(tags) > 1 {
      comment.Tags.Tag2 = tags[1]
    }
    if len(tags) > 2 {
      comment.Tags.Tag3 = tags[2]
    }


    message, err := json.Marshal(comment)
    if err != nil {
      fmt.Println("Error marshaling comment:", err)
      continue
    }
    if _, err := ws.Write(message); err != nil {
      fmt.Println("Write error:", err)
    }
  }
  if err = rows.Err(); err != nil {
    fmt.Println("Error rows.Err():", err)
  }
}

// Retrieve commentids of comments the user has liked/disliked
func (s *Server) retrieveLikes(ws *websocket.Conn, fingerprint string) {
  rows, err := db.Query(`
    SELECT comment_id, "like"
    FROM comments_interactions
    WHERE fingerprint = $1;`,
    fingerprint,
  )
  if err != nil {
    fmt.Println("Error querying the database in retrieveLikes:", err)
    return
  }
  defer rows.Close()

  interactions := History{Type: "history", Likes: []int{}, Dislikes: []int{}}

  for rows.Next() {
    var commentid int
    var like bool
    if err := rows.Scan(&commentid, &like); err != nil {
      fmt.Println("Error scanning comments_interactions row:", err)
      continue
    }

    if like == true {
      interactions.Likes = append(interactions.Likes, commentid)
    } else {
      interactions.Dislikes = append(interactions.Dislikes, commentid)
    }
  }
  if err := rows.Err(); err != nil {
    fmt.Println("Error iterating over rows in retrieveLikes:", err)
  }

  message, err := json.Marshal(interactions)
  if err != nil {
    fmt.Println("Error marshalling likes/dislikes map:", err)
    return
  }
  if _, err := ws.Write(message); err != nil {
    fmt.Println("Error writing likes/dislikes map to ws:", err)
  }
}

func (s *Server) readLoop(ws *websocket.Conn, fingerprint string) {
  buf := make([]byte, 1024) //1024 bytes of message can be loaded into the buffer
  for {
    n, err := ws.Read(buf)
    if err != nil {
      if err == io.EOF { //Connection closed on client end
        break
      }
      fmt.Println("Error:", err)
      break  //Maybe there is a better way to handle this error than just breaking
    }
    msg := buf[:n] //Only read out the bytes of the buffer that were used
    var message WebsocketMessage
    if err := json.Unmarshal(msg, &message); err != nil {
      fmt.Println("Error unmarshalling json:", err)
      break
    }

    if message.Type == "pong" {
      err = ws.SetDeadline(time.Now().Add(60 * time.Second))
		  if err != nil {
			  fmt.Println("SetDeadline error:", err)
			  break 
		  }
		} else {
      s.handleMessage(message, fingerprint) // Broadcast the message to all clients
	  }  
  }
}

func (s *Server) handleMessage(message WebsocketMessage, fingerprint string) {
  switch message.Type {
  case "new_comment":
    comment, err := s.insertComment(message.ParentID, message.Text, message.Latitude, message.Longitude, message.Tags, fingerprint)
    if err != nil {
      fmt.Println("Error writing comment to db:", err)
      return
    }
    s.broadcast(WebsocketReply{
      Type: "new_comment",
      Comment: &comment,
    }, message.Latitude, message.Longitude)

  case "like_update":
    fmt.Println("Recieved like_update")
    likeLat, likeLng, updatedLikes, updatedDislikes, err := s.interact(message.CommentID, "likes", message.Like, fingerprint)
    if err != nil {
      fmt.Println("Error updating likes:", err)
      return
    }
    fmt.Println("Broadcasting like_update reply Type,CommentID,Likes,Dislikes:","like_update",message.CommentID,updatedLikes,updatedDislikes)
    s.broadcast(WebsocketReply{
      Type: "like_update",
      CommentID: message.CommentID,
      Likes: intPtr(updatedLikes),
      Dislikes: intPtr(updatedDislikes),
    }, likeLat, likeLng)

  case "dislike_update":
    fmt.Println("Recieved disliked_update")
    dislikeLat, dislikeLng, updatedLikes, updatedDislikes, err := s.interact(message.CommentID, "dislikes", message.Dislike, fingerprint)
    if err != nil {
      fmt.Println("Error updating dislikes:", err)
      return
    }
    fmt.Println("Broadcasting dislike_update reply Type,CommentID,Likes,Dislikes:","like_update",message.CommentID,updatedLikes,updatedDislikes)
    s.broadcast(WebsocketReply{
      Type: "like_update",
      CommentID: message.CommentID,
      Likes: intPtr(updatedLikes),
      Dislikes: intPtr(updatedDislikes),
    }, dislikeLat, dislikeLng)

  case "reply_update":
    comment, replyLat, replyLng, err := s.insertReply(message.ParentID, message.Text, fingerprint)
    if err != nil {
      fmt.Println("Error writing reply to db:", err)
      return
    }
    s.broadcast(WebsocketReply{
      Type: "reply_update",
      Comment: &comment,
    }, replyLat, replyLng)
  }
}

func intPtr(i int) *int {
  return &i
}

func (t *Tags) ToSlice() []string {
    tags := []string{t.Tag1}
    if t.Tag2 != "" {
        tags = append(tags, t.Tag2)
    }
    if t.Tag3 != "" {
        tags = append(tags, t.Tag3)
    }
    return tags
}

func (s *Server) insertComment(parentID *int, text string, lat float64, lng float64, tags Tags, fingerprint string) (Comment, error) {
    var id int
    var timestamp time.Time

    err := db.QueryRow(`
      INSERT INTO comments (parent_id, text, location, timestamp, tags, author) VALUES
      ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5, $6, $7)
      RETURNING id, timestamp;`,
      parentID, text, lat, lng, time.Now().In(nyc), pq.Array(tags.ToSlice()), fingerprint).Scan(&id, &timestamp)
      if err != nil {
      fmt.Println("Error writing to table comments:", err)
      return Comment{}, err
    }

    return Comment{
      ID: id,
      ParentID: parentID,
      Text: text,
      Likes: 0,
      Dislikes: 0,
      Timestamp: timestamp,
      Tags: tags,
    }, nil
}

func (s *Server) insertReply(parentID *int, text string, fingerprint string) (Comment, float64, float64, error) {
  var id int
  var timestamp time.Time
  var lat, lng float64

  err := db.QueryRow(`
    INSERT INTO comments (parent_id, text, location, timestamp, author) VALUES
    ($1, $2, (SELECT location FROM comments WHERE id = $1), $3, $4)
    RETURNING id, timestamp, ST_X(location::geometry), ST_Y(location::geometry);`,
    parentID, text, time.Now().In(nyc), fingerprint).Scan(&id, &timestamp, &lat, &lng)
  if err != nil {
    fmt.Println("Error writing reply to table comments:", err)
    return Comment{}, 0, 0, err
  }

  return Comment{
    ID: id,
    ParentID: parentID,
    Text: text,
    Likes: 0,
    Dislikes: 0,
    Timestamp: timestamp,
  }, lat, lng, nil
}

func checkInteraction(commentid int, fingerprint string) (bool, bool, error) {
  var liked bool
  var disliked bool
  rows, err := db.Query(`
    SELECT "like"
    FROM comments_interactions
    WHERE fingerprint = $1
    AND comment_id = $2;`,fingerprint, commentid)
  if err != nil {
    fmt.Println("Error retrieving interactions with comment")
    return false, false, err
  }
  defer rows.Close()

  for rows.Next() {
    var interaction bool
    if err := rows.Scan(&interaction); err != nil {
      fmt.Println("Error scanning interaction:", err)
    }
    if interaction == true {
      liked = true
    } else {
      disliked = true
    }
  }
  fmt.Println("CommentID, Liked, Disliked:", commentid, liked, disliked)
  return liked, disliked, nil
}

func (s *Server) interact(id int, column string, increment bool, fingerprint string) (float64, float64, int, int, error) {
  liked, disliked, err := checkInteraction(id, fingerprint)
  if err != nil {
    fmt.Println("Error checking for interactions with comment:", err)
    return 0,0,0,0,err
  }

  if column == "likes" {
    if liked { // User has liked the comment previously
      // Check if the user is attempting to re-like the comment
      if increment { // User attempting to add like to a comment they have already liked -> Error
        return 0,0,0,0,err
      }

      // User attempting to remove like from comment they have liked -> Valid
      err := removeInteraction(id, fingerprint, true)
      if err != nil { return 0,0,0,0,err }
      lat, lng, likes, dislikes, err := updateComment(id, "likes", "- 1")
      if err != nil { return 0,0,0,0,err}
      // If not returned, like has been removed from comment successfully
      return lat,lng,likes,dislikes,nil

    } else { // User has disliked the comment previously
      // User wants to like interact with a comment they have disliked
      if increment == false { // User is trying to unlike a comment they have disliked -> Error
        return 0,0,0,0,err
      }

      if disliked {
        // User wants to add a like to a comment they have previously disliked
        // Remove the users dislike
        err := removeInteraction(id, fingerprint, false)
        if err != nil { return 0,0,0,0,err}
        _,_,_,_,err = updateComment(id, "dislikes", "-1")
        if err != nil { return 0,0,0,0,err}
      }

      // Add the like to the comment
      err = addInteraction(id, fingerprint, true)
      if err != nil {return 0,0,0,0,err}
      lat, lng, likes, dislikes, err := updateComment(id, "likes", "+ 1")
      if err != nil {return 0,0,0,0,err}
      return lat,lng,likes,dislikes,nil
    }



  // Dislike interaction
  } else {
    if disliked { // User has disliked the comment previously
      // Check if the user is attempting to re-dislike the comment
      if increment { // User attempting to add dislike to a comment they have already disliked -> Error
        return 0,0,0,0,err
      }

      // User attempting to remove dislike from comment they have disliked -> Valid
      err := removeInteraction(id, fingerprint, false)
      if err != nil { return 0,0,0,0,err }
      lat, lng, likes, dislikes, err := updateComment(id, "dislikes", "- 1")
      if err != nil { return 0,0,0,0,err}
      // If not returned, dislike has been removed from comment successfully
      return lat,lng,likes,dislikes, nil

    } else { // User has liked the comment previously
      // User wants to dislike interact with a comment they have liked
      if increment == false { // User is trying to un-dislike a comment they have liked -> Error
        return 0,0,0,0,err
      }

      if liked {
        // User wants to add a dislike to a comment they have previously liked
        // Remove the users like
        err := removeInteraction(id, fingerprint, true)
        if err != nil { return 0,0,0,0,err}
        _,_,_,_,err = updateComment(id, "likes", "-1")
        if err != nil { return 0,0,0,0,err}
      }

      // Add the dislike to the comment
      err = addInteraction(id, fingerprint, false)
      if err != nil {return 0,0,0,0,err}
      lat, lng, likes, dislikes, err := updateComment(id, "dislikes", "+ 1")
      if err != nil {return 0,0,0,0,err}
      return lat,lng,likes,dislikes,nil
    }
  }
}

func addInteraction(id int, fingerprint string, like bool) (error) {
  _, err := db.Exec(`
    INSERT into comments_interactions (comment_id, fingerprint, "like") VALUES
    ($1, $2, $3);`, id, fingerprint, like)
  if err != nil {
    fmt.Println("Error adding interaction in addInteraction:", err)
    return err
  }
  return nil
}

func removeInteraction(id int, fingerprint string, like bool) (error) {
  // Remove the like from comments_interactions
  _, err := db.Exec(`
    DELETE FROM comments_interactions
    WHERE comment_id = $1
    AND fingerprint = $2
    AND "like" = $3;
    `, id, fingerprint, like)
  if err != nil {
    fmt.Println("Error removing interaction in removeInteraction:", err)
    return err
  }
  return nil
}

func updateComment(id int, column string, update string) (float64, float64, int, int, error) {
  var lat, lng float64
  var likes, dislikes int
  query := fmt.Sprintf("UPDATE comments SET %s = %s %s WHERE id = $1 RETURNING ST_X(location::geometry), ST_Y(location::geometry), likes, dislikes;", column, column, update)
  err := db.QueryRow(query, id).Scan(&lat, &lng, &likes, &dislikes)
  if err != nil {
    fmt.Println("Error updating the likes/dislikes of comment:", err)
    return 0, 0, 0, 0, err
  }
  return lat, lng, likes, dislikes, nil
 
}

func (s *Server) findClose(lat float64, lng float64) ([]string, error) {

  rows, err := db.Query(`
    SELECT fingerprint
    FROM users
    WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), 5000);`,
    lat, lng,
  ) //5000 = 5km radius
  if err != nil {
    fmt.Println("Error retrieving close users:", err)
    return nil, err
    }
  defer rows.Close()

  var fingerprints []string

  for rows.Next() {
    var fingerprint string
    if err := rows.Scan(&fingerprint); err != nil {
      return nil, err
    }
    fingerprints = append(fingerprints, fingerprint)
  }

  return fingerprints, nil
}

func (s *Server) broadcast(reply WebsocketReply, lat float64, lng float64) {

  closeFingerprints, err := s.findClose(lat, lng)
  if err != nil {
    fmt.Println("Unable to broadcast. Error retrieving close users: ", err)
    return
  }

  for _, fingerprint := range closeFingerprints {
    if ws, ok := s.conns[fingerprint]; ok {
      go func(ws *websocket.Conn) {
        message, err := json.Marshal(reply)
        if err != nil {
          fmt.Println("Error marshalling reply:", err)
          return
        }
        if _, err := ws.Write(message); err != nil {
          fmt.Println("Write error:", err)
        }
      }(ws)
    }
  }
}  
