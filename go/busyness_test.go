package main

import (
	// "context"
	// "log"
	// "os"
	// "strings"
	"testing"

	// pb "backend/grpc-client"

	// "google.golang.org/grpc"
)

//sample test to run the auto flow 
func TestPass(t *testing.T) {
	// Test case
	expected := 10
	result := add(5, 5)

	// Assertion
	if result != expected {
		t.Errorf("Expected %d, but got %d", expected, result)
	}
}

// add is a helper function to add two numbers
func add(a, b int) int {
	return a + b
}
