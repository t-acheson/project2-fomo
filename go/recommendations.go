package main

import (
	"context" // Context handling
	"flag"    // Command-line flag parsing
	"log"     // Log output
	"time"    // For measuring/displaying time

	"google.golang.org/grpc"                     // gRPC package
	"google.golang.org/grpc/credentials"         // Credential support for gRPC used for TLS
	"google.golang.org/grpc/credentials/insecure" // Supports insecure connections
	pb "backend/grpc-client"                     // Import generated gRPC code from proto file as pb
)

// Command line flags
var (
	tlsFlag            = flag.Bool("tls", false, "Connection uses TLS if true, else plain TCP") // Specify if TLS should be used
	caFile             = flag.String("ca_file", "", "The file containing the CA root cert file") // Specify path of CA root cert file
	serverAddr         = flag.String("addr", "grpc:50051", "The server address in the format of host:port")
	serverHostOverride = flag.String("server_host_override", "localhost", "The server name used to verify the hostname returned by the TLS handshake")
)

// printRecommendation sends recommendation request to Python gRPC server and logs response
func printRecommendation(client pb.RecommendationClient, locationID int) {
	// Sends recommendation request to Python gRPC server and logs response
	log.Printf("Sending recommendation request for Location ID: %d", locationID)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second) // Create context with 10s timeout for request
	defer cancel()
	start := time.Now()                                                   // Record the start time
	reply, err := client.SendRecommendation(ctx, &pb.RecommendationRequest{Locationid: int64(locationID)}) // Send request to server and receive reply
	duration := time.Since(start)                                          // Calculate the duration
	if err != nil {
		log.Fatalf("client.SendRecommendation failed: %v", err)
	}
	log.Printf("Reply: %s, received in time: %s", reply.Busyness, duration)
}

func testRecommend() {
	flag.Parse() // Parse command line flags
	var opts []grpc.DialOption
	if *tlsFlag { // Configure gRPC dial options
		if *caFile == "" {
			log.Fatalf("ca_file must be provided when tls is enabled")
		}
		creds, err := credentials.NewClientTLSFromFile(*caFile, *serverHostOverride)
		if err != nil {
			log.Fatalf("Failed to create TLS credentials: %v", err)
		}
		opts = append(opts, grpc.WithTransportCredentials(creds))
	} else {
		opts = append(opts, grpc.WithTransportCredentials(insecure.NewCredentials()))
	}

	conn, err := grpc.Dial(*serverAddr, opts...) // Establishes connection to gRPC server
	if err != nil {
		log.Fatalf("Fail to dial : %v", err)
	}
	defer conn.Close()
	client := pb.NewRecommendationClient(conn) // Create new gRPC client

	// Test printRecommendation with a sample location ID
	printRecommendation(client, 1) // Replace 1 with the actual location ID you want to test
}
