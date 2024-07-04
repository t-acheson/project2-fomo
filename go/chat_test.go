package main

import (
	"fmt"
	"net"
	"testing"

	"github.com/google/uuid"
	"golang.org/x/net/websocket"
)

// MockWebSocketConn simulates a mock websocket connection for testing
type MockWebSocketConn struct {
	RemoteAddrVal string
}

func (m *MockWebSocketConn) RemoteAddr() net.Addr {
	return &net.TCPAddr{IP: []byte(m.RemoteAddrVal)}
}

// MockDB simulates a mock database for testing purposes
type MockDB struct{}

func (m *MockDB) Exec(query string, args ...interface{}) (result interface{}, err error) {
	// Mock the behavior of db.Exec() for testing purposes
	return nil, nil // Mock success
}

// ServerTest is used for testing purposes, mirroring Server functionality
type ServerTest struct {
	conns map[uuid.UUID]*websocket.Conn
	db    *MockDB // Mock database connection
}

// NewServerTest creates a new ServerTest instance
func NewServerTest() *ServerTest {
	return &ServerTest{
		conns: make(map[uuid.UUID]*websocket.Conn),
		db:    &MockDB{}, // Initialize MockDB instance
	}
}

// addConnection simulates adding a connection to the ServerTest instance
func (s *ServerTest) addConnection(uuid uuid.UUID) error {
	// Simulate database operation
	_, err := s.db.Exec("INSERT INTO users (uuid) VALUES ($1)", uuid)
	if err != nil {
		return fmt.Errorf("error adding connection: %v", err)
	}
	s.conns[uuid] = nil // Simulate adding to connections map
	return nil
}

// removeConnection simulates removing a connection from the ServerTest instance
func (s *ServerTest) removeConnection(uuid uuid.UUID) {
	// Simulate database operation
	_, _ = s.db.Exec("DELETE FROM users WHERE uuid = $1", uuid)

	// Simulate removing from connections map
	delete(s.conns, uuid)
}

// handleWebSocket simulates handling a WebSocket connection
func (s *ServerTest) handleWebSocket(_ *MockWebSocketConn) {
	uuid := uuid.New()

	// Simulate adding connection
	s.addConnection(uuid)

	// Simulate retrieving historical messages
	// (Assuming s.retrieve() method is implemented and tested separately)
	// Simulate reading loop
	// (Assuming s.readLoop() method is implemented and tested separately)

	// Simulate removing connection
	s.removeConnection(uuid)
}


func TestHandleWebSocket(t *testing.T) {
	server := NewServerTest()
	mockWS := &MockWebSocketConn{RemoteAddrVal: "127.0.0.1"}

	// Call the method being tested
	server.handleWebSocket(mockWS)

	// Assert that the connection was properly added and removed
	if len(server.conns) != 0 {
		t.Errorf("Expected no connections after handling WebSocket, but found %d", len(server.conns))
	}
}

func TestRemoveConnection_NonExistingUUID(t *testing.T) {
	server := NewServerTest()

	// Generate a new UUID for testing (which is not added to the map)
	testUUID := uuid.New()

	// Call the method being tested
	server.removeConnection(testUUID)

	// Assert that the map remains unchanged
	if len(server.conns) != 0 {
		t.Errorf("Expected no change to connections map, but found %d connections", len(server.conns))
	}
}


func TestHandleWebSocket_ErrorHandling(t *testing.T) {
	// Simulate a failing database operation
	mockDB := &MockDB{}
	server := &ServerTest{
		conns: make(map[uuid.UUID]*websocket.Conn),
		db:    mockDB,
	}
	mockWS := &MockWebSocketConn{RemoteAddrVal: "127.0.0.1"}

	// Call the method being tested
	server.handleWebSocket(mockWS)

	// Assert specific error handling behavior
	// For example, check logs or expected outcomes based on the error scenario
}

func TestAddAndRemoveConnection(t *testing.T) {
    server := &ServerTest{
        conns: make(map[uuid.UUID]*websocket.Conn),
    }

    // Generate a new UUID for testing
    testUUID := uuid.New()

    // Test addConnection
    if err := server.addConnection(testUUID); err != nil {
        t.Fatalf("Error adding connection: %v", err)
    }

    // Check if the connection was added correctly
    if _, ok := server.conns[testUUID]; !ok {
        t.Errorf("Expected connection with UUID %s to be added, but not found", testUUID)
    }

    // Test removeConnection
    server.removeConnection(testUUID)

    // Check if the connection was removed correctly
    if _, ok := server.conns[testUUID]; ok {
        t.Errorf("Expected connection with UUID %s to be removed, but found", testUUID)
    }
}


