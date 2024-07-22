package main

import (
	"testing"
	"time"
	// "database/sql"
//  "github.com/lib/pq" // Import Postgres driver
)

// Define a mock server struct for testing
type MockServer struct{}

// Implement the getTopComment function
func (s *MockServer) getTopComment(lat float64, lng float64) (*Comment, error) {
	// Mock implementation for testing
	return &Comment{
		ID:        1,
		ParentID:  nil,
		Text:      "This is a top comment",
		Likes:     100,
		Dislikes:  5,
		Timestamp: time.Now(),
	}, nil
}


// Test the getTopComment function
func TestGetTopComment(t *testing.T) {

	// Mock server for testing
	server := &MockServer{}

	// Test data
	lat := 37.7749
	lng := -122.4194

	// Call the getTopComment function
	comment, err := server.getTopComment(lat, lng)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Check if the comment returned is as expected
	expectedText := "This is a top comment"
	if comment.Text != expectedText {
		t.Errorf("Expected text %s, got %s", expectedText, comment.Text)
	}
	if comment.Likes != 100 {
		t.Errorf("Expected likes %d, got %d", 100, comment.Likes)
	}
}
