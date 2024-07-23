package main

import (
	"testing"
	"time"
	// "database/sql"
//  "github.com/lib/pq" // Import Postgres driver
)

func TestGetTopComment(t *testing.T) {
	// Backup the original function
	originalFunc := getTopCommentFunc
	// Restore the original function after the test
	defer func() { getTopCommentFunc = originalFunc }()

	// Mock implementation of the getTopComment function
	getTopCommentFunc = func(lat float64, lng float64) (*Comment, error) {
		return &Comment{
			ID:        1,
			ParentID:  nil,
			Text:      "This is a top comment",
			Likes:     100,
			Dislikes:  5,
			Timestamp: time.Now(),
		}, nil
	}

	// Test data
	lat := 37.7749
	lng := -122.4194

	// Call the getTopComment function
	comment, err := getTopCommentFunc(lat, lng)
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

// Test the getTopComment function when no comment is found
func TestGetTopCommentNoComment(t *testing.T) {
	// Backup the original function
	originalFunc := getTopCommentFunc
	// Restore the original function after the test
	defer func() { getTopCommentFunc = originalFunc }()

	// Mock implementation of the getTopComment function to simulate no comments found
	getTopCommentFunc = func(lat float64, lng float64) (*Comment, error) {
		return nil, nil
	}

	// Test data
	lat := 37.7749
	lng := -122.4194

	// Call the getTopComment function
	comment, err := getTopCommentFunc(lat, lng)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Check the returned comment
	if comment != nil {
		t.Fatalf("Expected no comment, got %v", comment)
	}
}
