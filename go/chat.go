package main

import (
  "golang.org/x/net/websocket"
  "sync"
  "fmt"
  "io"
  "time"
  "net/http"
  //"encoding/json"
)

type Server struct {
  conns map[*websocket.Conn]bool
  mu sync.Mutex
}

type Comment struct {
  Timestamp int64 `json:"timestamp"`
  Text string `json:"test"`
  Lat float64 `json:"lat"`
  Lng float64 `json:"lng"`
}

var comments []Comment

func NewServer() *Server {
  return &Server {
    conns: make(map[*websocket.Conn]bool),
  }
}

func (s *Server) handleWebSocket(ws *websocket.Conn) {
  s.mu.Lock()
  defer s.mu.Unlock()

  fmt.Println("New incoming connection from client:", ws.RemoteAddr())

  s.conns[ws] = true
  
  s.mu.Unlock()
  s.readLoop(ws)
  s.mu.Lock()

  fmt.Println("Client disconnected at", ws.RemoteAddr())
  delete(s.conns, ws)
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
   
    comment := Comment{Timestamp: time.Now().UnixNano(), Text: string(msg)}
    s.broadcast(msg) // Broadcast the message to all clients

    s.mu.Lock()
    comments = append(comments, comment)
    s.mu.Unlock()

    // Then, place the comment in the database
  }
}

func (s *Server) broadcast(b []byte) {
  for ws := range s.conns {
    go func(ws *websocket.Conn) {
      if _, err := ws.Write(b); err != nil {
        fmt.Println("Write error:", err)
      }
    }(ws)
  }
}

func chat() {
  server := NewServer()
  http.Handle("/ws", websocket.Handler(server.handleWebSocket))
  //http.HandleFunc("/comments", handleGetComments)
  http.ListenAndServe(":3000", nil)
}

