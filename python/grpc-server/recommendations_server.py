"""Python implementation of a gRPC server"""

import logging
from concurrent import futures
import grpc
import recommendations_pb2
import recommendations_pb2_grpc

def get_recommendation(request):
    """Calculate recommended locations based on inputs"""
    if request.category == "categ1" and request.datetime == "date":  # I.e. if request == expected sample request outlined in recommendations.go
        return "Success" 
    return

class RecommendationsServicer(recommendations_pb2_grpc.RecommendationServicer):
    """Provides methods that implement functionality of recommendations server"""

    def SendRecommendation(self, request, context):
        """Method to send recommendation response back to client based on response"""
        recommendation = get_recommendation(request)
        if recommendation is None: # Invalid request recieved
            #Send default/empty reply
            return recommendations_pb2.RecommendationReply(name="", id=0, lat=0, lng=0) #ADD INPUTS LATER
        else:
            return recommendations_pb2.RecommendationReply(name="SUCCESS", id=100, lat=1.23, lng=4.56)

def serve():
    """Configures and starts the gRPC server"""
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10)) #Create gRPC server with thread pool of up to 10 threads to handle RPC calls
    recommendations_pb2_grpc.add_RecommendationServicer_to_server( #Register service implementation with server
        RecommendationsServicer(), server
    )
    server.add_insecure_port("[::]:50051") #Bind server to port 50051 on all available IP addresses
    server.start()
    server.wait_for_termination() #Block current thread until terminated

if __name__ == "__main__":
    logging.basicConfig()
    serve()
