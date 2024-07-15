"""Python implementation of a gRPC server"""

import logging
from concurrent import futures
import grpc
import busyness_pb2
import busyness_pb2_grpc
import grpc_model

def get_busyness(request):
    """Estimate busyness based on locationid"""
    if not 1 <= request.locationid <= 263:
        return None
    return grpc_model.predict_busyness(request.locationid)

class BusynessServicer(busyness_pb2_grpc.BusynessServicer):
    """Provides methods that implement functionality of busyness server"""

    def SendLocationID(self, request, context):
        """Method to send busyness response back to client based on locationid request"""
        print("Receieved busyness request. Sending reply.")
        busynessReply = get_busyness(request)
        if busynessReply is None: # Invalid request recieved
            #Send default/empty reply
            return busyness_pb2.BusynessReply(busyness="Invalid input")
        else:
            return busyness_pb2.BusynessReply(busyness=busynessReply)

def serve():
    """Configures and starts the gRPC server"""
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10)) #Create gRPC server with thread pool of up to 10 threads to handle RPC calls
    busyness_pb2_grpc.add_BusynessServicer_to_server( #Register service implementation with server
        BusynessServicer(), server
    )
    server.add_insecure_port("[::]:50051") #Bind server to port 50051 on all available IP addresses
    server.start()
    print("gRPC Server started!")
    server.wait_for_termination() #Block current thread until terminated

if __name__ == "__main__":
    logging.basicConfig()
    serve()
