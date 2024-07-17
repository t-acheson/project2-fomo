# test_recommendations_server.py

import unittest
import grpc
import logging
from concurrent import futures
from unittest.mock import MagicMock

import busyness_pb2
import busyness_pb2_grpc
from busyness_server import BusynessServicer, serve

class TestBusynessServicer(unittest.TestCase):

    def setUp(self):
        self.server = grpc.server(futures.ThreadPoolExecutor(max_workers=1))
        busyness_pb2_grpc.add_BusynessServicer_to_server(BusynessServicer(), self.server)
        self.server.add_insecure_port("[::]:50051")
        self.server.start()

    def tearDown(self):
        self.server.stop(0)

    def test_send_busyness_success(self):
        # Create a stub client
        channel = grpc.insecure_channel('localhost:50051')
        stub = busyness_pb2_grpc.BusynessStub(channel)

        # Create a mock request
        request = busyness_pb2.BusynessRequest(locationid=1)

        # Mock the response
        expected_reply = busyness_pb2.BusynessReply(busyness="Quiet")
        stub.SendLocationID = MagicMock(return_value=expected_reply)

        # Make gRPC call
        response = stub.SendLocationID(request)

        # Assert the response
        self.assertEqual(response, expected_reply)

    def test_send_busyness_invalid_request(self):
        # Create a stub client
        channel = grpc.insecure_channel('localhost:50051')
        stub = busyness_pb2_grpc.BusynessStub(channel)

        # Create an invalid request
        request = busyness_pb2.BusynessRequest(locationid=0)

        # Mock the response
        expected_reply = busyness_pb2.BusynessReply(busyness="Invalid input")
        stub.SendLocationID = MagicMock(return_value=expected_reply)

        # Make gRPC call
        response = stub.SendLocationID(request)

        # Assert the response
        self.assertEqual(response, expected_reply)

if __name__ == "__main__":
    logging.basicConfig()
    unittest.main()

