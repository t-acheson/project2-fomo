package main

import (
  "golang.org/x/net/websocket"
  //"sync"
  "fmt"
  "io"
  "time"
  "encoding/json"
  "github.com/google/uuid"
  "math/rand"
)

type Server struct {
  conns map[uuid.UUID]*websocket.Conn
  //mu sync.Mutex
}

type Comment struct {
  Timestamp time.Time `json:"timestamp"`
  Text string `json:"text"`
  Lat float64 `json:"lat"`
  Lng float64 `json:"lng"`
  Likes int64 `json:"likes"`
  Dislikes int64 `json:"dislikes"`
}

func NewServer() *Server {
  return &Server {
    conns: make(map[uuid.UUID]*websocket.Conn),
  }
}

func (s *Server) handleWebSocket(ws *websocket.Conn) {
  //s.mu.Lock()
  //defer s.mu.Unlock()

  fmt.Println("New incoming connection from client:", ws.RemoteAddr())

  uuid := uuid.New()

  start := time.Now()
  s.addConnection(uuid)
  duration := time.Since(start)
  fmt.Println("Added connection to users table in time:", duration)

  s.conns[uuid] = ws

  // Retreive historical messages
  start = time.Now()
  s.retrieve(ws)
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

// ! For temporary use until lat/lng can be passed to backend
func rangeIn(low, hi int) int {
    return low + rand.Intn(hi-low)
}

// ! Pass in location from frontend as argument
func (s *Server) addConnection(uuid uuid.UUID) {
  _, err := db.Exec(`
    INSERT INTO users (uuid, location) VALUES
    ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326))`,
    uuid, rangeIn(1,3), rangeIn(1,3), // ! Temporary random numbers
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
func (s *Server) retrieve(ws *websocket.Conn) {
  rows, err := db.Query(`
  SELECT timestamp, text, likes, dislikes, ST_Y(location::geometry) as lat, ST_X(location::geometry) as lng
    FROM comments
    WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), 5000);`,
  rangeIn(1,3), rangeIn(1,3), // CHANGE TO ACTUAL USER LOCATION AFTER FRONTEND INTEGRATION
  )
  defer rows.Close()
  
  for rows.Next() {
    var comment Comment
    if err := rows.Scan(&comment.Timestamp, &comment.Text, &comment.Lat, &comment.Lng); err != nil {
      fmt.Println("Error retrieving comment from database:", err)
      continue
    }
    message, err := json.Marshal(comment)
    if err != nil {
      fmt.Println("Error mashaling comment:", err)
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
    var comment Comment
    if err := json.Unmarshal(msg, &comment); err != nil {
      fmt.Println("Error unmarshalling json:", err)
      continue //Likely the users fault so we want the application to continue
    }

    // Insert the comment into the database
    s.insertComment(comment)

    //comment := Comment{Timestamp: time.Now().UnixNano(), Text: string(msg)}
    s.broadcast(comment) // Broadcast the message to all clients

    //s.mu.Lock()
    //comments = append(comments, comment)
    //s.mu.Unlock()

    // Then, place the comment in the database
  }
}

func (s *Server) insertComment(comment Comment) {
    comment.Timestamp = time.Now().UTC()

    _, err := db.Exec(`
      INSERT INTO comments (timestamp, text, likes, dislikes, location) VALUES
      ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326));`,
      comment.Timestamp, comment.Text, comment.Lat, comment.Lng,
    )
    if err != nil {
      fmt.Println("Error writing to table comments:", err)
    }

}

func (s *Server) interact(id int, column string, value int) {
  _, err := db.Exec(`
  SELECT update_like_dislikes($1, $2, $3);`,
  id, column, value)
  if err != nul {
    fmt.Println("Error interacting with comment:", err)
  }
}

func (s *Server) findClose(comment Comment) ([]uuid.UUID, error) {

  rows, err := db.Query(`
    SELECT uuid
    FROM users
    WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), 5000);`,
    comment.Lat, comment.Lng,
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

func (s *Server) broadcast(comment Comment) {

  closeUUIDs, err := s.findClose(comment)
  if err != nil {
    fmt.Println("Unable to broadcast. Error retrieving close users: ", err)
    return
  }

  for _, uuid := range closeUUIDs {
    if ws, ok := s.conns[uuid]; ok {
      go func(ws *websocket.Conn) {
        message, err := json.Marshal(comment)
        if err != nil {
          fmt.Println("Error marshalling comment:", err)
          return
        }
        if _, err := ws.Write(message); err != nil {
          fmt.Println("Write error:", err)
        }
      }(ws)
    }
  }
}  
