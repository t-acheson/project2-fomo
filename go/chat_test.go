package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"golang.org/x/net/websocket"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// Mock the global db variable
var mockDB *sql.DB
var mock sqlmock.Sqlmock

func TestMain(m *testing.M) {
	var err error
	mockDB, mock, err = sqlmock.New()
	if err != nil {
		panic(err)
	}
	defer mockDB.Close()

	db = mockDB // Use the mock DB in the global db variable

	m.Run()
}

func TestWebSocketServer(t *testing.T) {
	server := NewServer()

	// Create a test HTTP server
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		s := websocket.Server{Handler: websocket.Handler(server.handleWebSocket)}
		s.ServeHTTP(w, r)
	}))
	defer ts.Close()

	// Create WebSocket URL
	wsURL := "ws" + ts.URL[len("http"):]

	// Connect to the WebSocket server
	ws, err := websocket.Dial(wsURL, "", "http://localhost/")
	require.NoError(t, err, "WebSocket dial should succeed")
	defer ws.Close()

	// Send a test message
	comment := Comment{
		Text: "Hello, World!",
		Lat:  37.7749,
		Lng:  -122.4194,
	}
	commentBytes, err := json.Marshal(comment)
	require.NoError(t, err, "JSON marshal should succeed")

	// Expect the insert query to be executed
	mock.ExpectExec(`INSERT INTO comments`).
		WithArgs(sqlmock.AnyArg(), comment.Text, comment.Lat, comment.Lng).
		WillReturnResult(sqlmock.NewResult(1, 1))

	_, err = ws.Write(commentBytes)
	require.NoError(t, err, "WebSocket write should succeed")

	// Read the response
	var received Comment
	err = websocket.JSON.Receive(ws, &received)
	require.NoError(t, err, "WebSocket read should succeed")

	// Validate the received comment
	assert.Equal(t, comment.Text, received.Text, "Comment text should match")
	assert.Equal(t, comment.Lat, received.Lat, "Comment latitude should match")
	assert.Equal(t, comment.Lng, received.Lng, "Comment longitude should match")
	assert.WithinDuration(t, time.Now().UTC(), received.Timestamp, time.Second, "Timestamp should be recent")

	// Ensure all expectations were met
	err = mock.ExpectationsWereMet()
	require.NoError(t, err, "There were unfulfilled expectations")
}
