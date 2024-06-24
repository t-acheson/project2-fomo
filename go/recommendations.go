package main

import (
  "context" // Context handling
  "flag" // Command-line flag parsing
  "log" // Log output
  "time" // For measuring/displaying time


  "google.golang.org/grpc" // gRPC package
	"google.golang.org/grpc/credentials" // Credential support for gRPC used for TLS
	"google.golang.org/grpc/credentials/insecure" // Supports insecure connections
	pb "backend/grpc-client" // Import generated gRPC code from proto file as pb
)

// Command line flags
var (
	tls                = flag.Bool("tls", false, "Connection uses TLS if true, else plain TCP") // Specify if TLS should be used
	caFile             = flag.String("ca_file", "", "The file containing the CA root cert file") // Specify path of CA root cert file
	serverAddr         = flag.String("addr", "localhost:50051", "The server address in the format of host:port")
	serverHostOverride = flag.String("server_host_override", "localhost", "The server name used to verify the hostname returned by the TLS handshake")
)

// printRecommendation -> test function
func printRecommendation(client pb.RecommendationClient, request *pb.RecommendationRequest) {
  // Sends recommendation request to Python gRPC server and logs response
  log.Printf("Receiving recommendation reply for: %s at %s", request.Category, request.Datetime)
  ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second) // Create context with 10s timeout for request
  defer cancel()
  start := time.Now() // Record the start time
  reply, err := client.SendRecommendation(ctx, request) // Send request to server and recieve reply
  duration := time.Since(start) // Calculate the duration
  if err != nil {
    log.Fatalf("client.SendRecommendation failed: %v", err)
  }
  log.Printf("Reply: %s, received in time: %s", reply.Name, duration)
} 

func testRecommend() {
  flag.Parse() // Parse command line flags
  var opts []grpc.DialOption
  if *tls { // Configure gRPC dial options
		if *caFile == "" {
			//*caFile = data.Path("x509/ca_cert.pem")
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
  
  conn, err := grpc.NewClient(*serverAddr, opts...) // Establishes connection to gRPC server
  if err != nil {
    log.Fatalf("Fail to dial : %v", err)
  }
  defer conn.Close()
  client := pb.NewRecommendationClient(conn) // Create new gRPC client

  //test printRecommendation with a sample request
  printRecommendation(client, &pb.RecommendationRequest{Category: "categ1", Datetime: "date"})
}
