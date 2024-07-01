package main

import (
  "golang.org/x/net/websocket"
  //"sync"
  "fmt"
  "io"
  "time"
  "encoding/json"
)

type Server struct {
  conns map[*websocket.Conn]bool
  //mu sync.Mutex
}

type Comment struct {
  Timestamp time.Time `json:"timestamp"`
  Text string `json:"text"`
  Lat float64 `json:"lat"`
  Lng float64 `json:"lng"`
}

func NewServer() *Server {
  return &Server {
    conns: make(map[*websocket.Conn]bool),
  }
}

func (s *Server) handleWebSocket(ws *websocket.Conn) {
  //s.mu.Lock()
  //defer s.mu.Unlock()

  fmt.Println("New incoming connection from client:", ws.RemoteAddr())

  s.conns[ws] = true

  // Retreive historical messages
  s.retrieve(ws)
  
  //s.mu.Unlock()
  s.readLoop(ws)
  //s.mu.Lock()

  fmt.Println("Client disconnected at", ws.RemoteAddr())
  delete(s.conns, ws)
}

// Select applicable historical comments and iteratively send them to the new client
func (s *Server) retrieve(ws *websocket.Conn) {
  rows, err := db.Query(`
    SELECT timestamp, text, ST_Y(location) as lat, ST_X(location) as lng
    FROM comments
    `) // WHERE ...
  defer rows.Close()
  
  for rows.Next() {
    var comment Comment
    if err := rows.Scan(&comment.Timestamp, &comment.Text, &comment.Lat, &comment.Lng); err != nil {
      fmt.Println("Error retrieving comment from database:", err)
      continue
    }
    //comments = append(comments, comment)
    if message, err := json.Marshall(comment); err != nil {
      fmt.Println("Error mashalling comment:", err)
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

    _, err = db.Exec(`
      INSERT INTO comments (timestamp, text, location) VALUES
      ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326))`,
      comment.Timestamp, comment.Text, comment.Lat, comment.Lng,
    )
    if err != nil {
      fmt.Println("Error writing to table comments:", err)
      continue // Same reason as continue above
    }

}

func (s *Server) broadcast(comment Comment) {
  for ws := range s.conns {
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
