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

// func TestPrintRecommendation(t *testing.T) {
// 	//connect to gRPC server
// 	conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
// 	if err != nil {
// 		t.Fatalf("Failed to dial server: %v", err)
// 	}
// 	defer conn.Close()

// 	//create a client instance 
// 	client := pb.NewRecommendationClient(conn)

// 	request := &pb.RecommendationRequest{
// 		Category: "categ1",
// 		Datetime: "date",
// 	}

// 	//calling server method 
// 	reply, err := client.SendRecommendation(context.Background(), request)
// 	if err!=nil {
// 		t.Fatalf("Failed to get reply from server: %v", err)	
// 	}

// 	//logs
// 	logs := captureLogs(func() {
// 		printRecommendation(client, request)
// 	})
// 	t.Logf("Logs captured during test execution:\n%s", logs)
	
// 	//checking logs
// 	expectedLog := "Receiving recommendation reply for: " + request.Category + " at " + request.Datetime
// 	if !contains(logs, expectedLog) {
// 		t.Errorf("expected log %q, got %q", expectedLog, logs)
// 	}

// 	expectedLog = "Reply: " + reply.Name
// 	if !contains(logs, expectedLog) {
// 		t.Errorf("expected log %q, got %q", expectedLog, logs)
// 	}
// }

	
	
// 	// captureLogs captures log output for testing
// func captureLogs(f func()) string {
// 	var buf strings.Builder
// 	log.SetOutput(&buf)
// 	defer func() {
// 		log.SetOutput(os.Stderr)
// 	}()
// 	f()
// 	return buf.String()
// }

// // contains checks if a substring is present in a string
// func contains(s, substr string) bool {
// 	return strings.Contains(s, substr)
// }
	
