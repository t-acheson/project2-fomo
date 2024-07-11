"""Python implementation of a gRPC server"""

import logging
from concurrent import futures
import grpc
import recommendations_pb2
import recommendations_pb2_grpc
import grpc_model

def get_recommendation(request):
    """Estimate busyness based on locationid"""
    if not isinstance(request.locationid, int):
        return None
    return grpc_model.predict_busyness(request.locationid)

class RecommendationsServicer(recommendations_pb2_grpc.RecommendationServicer):
    """Provides methods that implement functionality of recommendations server"""

    def SendRecommendation(self, request, context):
        """Method to send recommendation response back to client based on response"""
        print("Receieved recommendation request. Sending reply.")
        recommendation = get_recommendation(request)
        print(request)
        if recommendation is None: # Invalid request recieved
            #Send default/empty reply
            return recommendations_pb2.RecommendationReply(busyness="Invalid input") #ADD INPUTS LATER
        else:
            return recommendations_pb2.RecommendationReply(busyness=recommendation)

def serve():
    """Configures and starts the gRPC server"""
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10)) #Create gRPC server with thread pool of up to 10 threads to handle RPC calls
    recommendations_pb2_grpc.add_RecommendationServicer_to_server( #Register service implementation with server
        RecommendationsServicer(), server
    )
    server.add_insecure_port("[::]:50051") #Bind server to port 50051 on all available IP addresses
    server.start()
    print("gRPC Server started!")
    server.wait_for_termination() #Block current thread until terminated

if __name__ == "__main__":
    logging.basicConfig()
    serve()
