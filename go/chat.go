package main

import (
  "golang.org/x/net/websocket"
  //"sync"
  "fmt"
  "io"
  "time"
  "encoding/json"
  "github.com/google/uuid"
)

type Server struct {
  conns map[uuid.UUID]*websocket.Conn
  //mu sync.Mutex
}

type Comment struct {
  ID int `json:"id"`
  ParentID *int `json:"parentid,omitempty"` //Pointer and omitempty to handle the parentid case.
  Text string `json:"text"`
  Lat float32 `json:"lat,omitempty"`  //Still necessary?
  Lng float32 `json:"lng,omitempty"`
  Likes int `json:"likes"`
  Dislikes int `json:"dislikes"`
  Timestamp time.Time `json:"timestamp"`
}

type WebsocketMessage struct {
  Type string `json:"type"`
  CommentID int `json:"commentid,omitempty"`
  ParentID *int `json:"parentid,omitempty"`
  Text string `json:"text,omitempty"`
  Likes int `json:"likes,omitempty"`
  Dislikes int `json:"dislikes,omitempty"`
  Latitude float64 `json:"lat,omitempty"`
  Longitude float64 `json:"lng,omitempty"`
}

type WebsocketReply struct {
  Type string `json:"type"`
  Comment *Comment `json:"comment,omitempty"`
  CommentID int `json:"commentid,omitempty"`
  Likes int `json:"likes,omitempty"`
  Dislikes int `json:"dislikes,omitempty"`
}

func NewServer() *Server {
  return &Server {
    conns: make(map[uuid.UUID]*websocket.Conn),
  }
}

func (s *Server) handleWebSocket(ws *websocket.Conn, lat float64, lng float64) {
  //s.mu.Lock()
  //defer s.mu.Unlock()

  fmt.Println("New incoming connection from client:", ws.RemoteAddr())

  uuid := uuid.New()

  start := time.Now()
  s.addConnection(uuid, lat, lng)
  duration := time.Since(start)
  fmt.Println("Added connection to users table in time:", duration)

  s.conns[uuid] = ws

  // Retreive historical messages
  start = time.Now()
  s.retrieve(ws, lat, lng)
  duration = time.Since(start)
  fmt.Println("Retreived historical messages for client in time:", duration)
  
  //s.mu.Unlock()
  s.readLoop(ws)
  //s.mu.Lock()

  fmt.Println("Client disconnected at", ws.RemoteAddr())
  start = time.Now()
  s.removeConnection(uuid)
  delete(s.conns, uuid)
  duration = time.Since(start)
  fmt.Println("Removed connection for users table in time:", duration)
}

// Add websocket client to the users table using their lat/lng
func (s *Server) addConnection(uuid uuid.UUID, lat float64, lng float64) {
  _, err := db.Exec(`
    INSERT INTO users (uuid, location) VALUES
    ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326))`,
    uuid, lat, lng,
  )
  if err != nil {
    fmt.Println("Error writing user to users table:", err)
  }
}

func (s *Server) removeConnection(uuid uuid.UUID) {
  _, err := db.Exec(`
    DELETE FROM users 
    WHERE uuid = $1`,
    uuid,
  )
  if err != nil {
    fmt.Println("Error removing user from users table:", err)
  }
}

// Select applicable historical comments and iteratively send them to the new client
func (s *Server) retrieve(ws *websocket.Conn, lat float64, lng float64) {
  rows, err := db.Query(`
  SELECT id, parent_id, timestamp, text, likes, dislikes
    FROM comments
    WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), 5000);`,
  lat, lng, // CHANGE TO ACTUAL USER LOCATION AFTER FRONTEND INTEGRATION
  )
  defer rows.Close()
  
  for rows.Next() {
    var comment Comment
    if err := rows.Scan(&comment.ID, &comment.ParentID, &comment.Timestamp, &comment.Text, &comment.Likes, &comment.Dislikes); err != nil {
      fmt.Println("Error retrieving comment from database:", err)
      continue
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

func (s *Server) readLoop(ws *websocket.Conn) {
  buf := make([]byte, 1024) //1024 bytes of message can be loaded into the buffer
  for {
    n, err := ws.Read(buf)
    if err != nil {
      if err == io.EOF { //Connection closed on client end
        break
      }
      fmt.Println("Error:", err)
      continue
    }
    msg := buf[:n] //Only read out the bytes of the buffer that were used
    var message WebsocketMessage
    if err := json.Unmarshal(msg, &message); err != nil {
      fmt.Println("Error unmarshalling json:", err)
      continue //Likely the users fault so we want the application to continue
    }

    s.handleMessage(message) // Broadcast the message to all clients
  }
}

func (s *Server) handleMessage(message WebsocketMessage) {
  switch message.Type {
  case "new_comment":
    comment, err := s.insertComment(message.ParentID, message.Text, message.Latitude, message.Longitude)
    if err != nil {
      fmt.Println("Error writing comment to db:", err)
      return
    }
    s.broadcast(WebsocketReply{
      Type: "new_comment",
      Comment: &comment,
    }, message.Latitude, message.Longitude)

  case "like_update":
    likeLat, likeLng, err := s.interact(message.CommentID, "likes", message.Likes)
    if err != nil {
      fmt.Println("Error updating likes:", err)
      return
    }
    s.broadcast(WebsocketReply{
      Type: "like_update",
      CommentID: message.CommentID,
      Likes: message.Likes,
    }, likeLat, likeLng, message.Longitude)

  case "dislike_update":
    dislikeLat, dislikeLng, err := s.interact(message.CommentID, "dislikes", message.Dislikes)
    if err != nil {
      fmt.Println("Error updating dislikes:", err)
      return
    }
    s.broadcast(WebsocketReply{
      Type: "dislike_update",
      CommentID: message.CommentID,
      Dislikes: message.Dislikes,
    }, dislikeLat, dislikeLng)

  case "reply_update":
    comment, replyLat, replyLng, err := s.insertReply(message.ParentID, message.Text)
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

func (s *Server) insertComment(parentID *int, text string, lat float64, lng float64) (Comment, error) {
    var id int
    var timestamp time.Time

    err := db.QueryRow(`
      INSERT INTO comments (parent_id, text, location, timestamp) VALUES
      ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5)
      RETURNING id, timestamp;`,
      parentID, text, lat, lng, time.Now()).Scan(&id, &timestamp)
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
    }, nil
}

func (s *Server) insertReply(parentID *int, text string) (Comment, float64, float64, error) {
  var id int
  var timestamp time.Time
  var lat, lng float64

  err := db.QueryRow(`
    INSERT INTO comments (parent_id, text, location, timestamp) VALUES
    ($1, $2, (SELECT location FROM comments WHERE id = $1), $3)
    RETURNING id, timestamp, ST_X(location), ST_Y(location);`,
    parentID, text, time.Now()).Scan(&id, &timestamp, &lat, &lng)
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

func (s *Server) interact(id int, column string, value int) (float64, float64, error) {
  var lat, lng float64
  query := fmt.Sprintf("UPDATE comments SET %s = $1 WHERE id = $2 RETURNING ST_X(location), ST_Y(location)", column)
  _, err := db.Exec(query, value, id).Scan(&lat, &lng)
  if err != nil {
    fmt.Println("Error updating the likes/dislikes of comment:", err)
    return 0, 0, err
  }
  return lat, lng, nil
}

func (s *Server) findClose(lat float64, lng float64) ([]uuid.UUID, error) {

  rows, err := db.Query(`
    SELECT uuid
    FROM users
    WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), 5000);`,
    lat, lng,
  ) //5000 = 5km radius
  if err != nil {
    fmt.Println("Error retrieving close users:", err)
    return nil, err
    }
  defer rows.Close()

  var uuids []uuid.UUID

  for rows.Next() {
    var uuid uuid.UUID
    if err := rows.Scan(&uuid); err != nil {
      return nil, err
    }
    uuids = append(uuids, uuid)
  }

  return uuids, nil
}

func (s *Server) broadcast(reply WebsocketReply, lat float64, lng float64) {

  closeUUIDs, err := s.findClose(lat, lng)
  if err != nil {
    fmt.Println("Unable to broadcast. Error retrieving close users: ", err)
    return
  }

  for _, uuid := range closeUUIDs {
    if ws, ok := s.conns[uuid]; ok {
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
