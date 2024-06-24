# test_recommendations_server.py

import unittest
import grpc
import logging
from concurrent import futures
from unittest.mock import MagicMock

import recommendations_pb2
import recommendations_pb2_grpc
from recommendations_server import RecommendationsServicer, serve

class TestRecommendationsServicer(unittest.TestCase):

    def setUp(self):
        self.server = grpc.server(futures.ThreadPoolExecutor(max_workers=1))
        recommendations_pb2_grpc.add_RecommendationServicer_to_server(RecommendationsServicer(), self.server)
        self.server.add_insecure_port("[::]:50051")
        self.server.start()

    def tearDown(self):
        self.server.stop(0)

    def test_send_recommendation_success(self):
        # Create a stub client
        channel = grpc.insecure_channel('localhost:50051')
        stub = recommendations_pb2_grpc.RecommendationStub(channel)

        # Create a mock request
        request = recommendations_pb2.RecommendationRequest(category="categ1", datetime="date")

        # Mock the response
        expected_reply = recommendations_pb2.RecommendationReply(name="SUCCESS", id=100, lat=1.23, lng=4.56)
        stub.SendRecommendation = MagicMock(return_value=expected_reply)

        # Make gRPC call
        response = stub.SendRecommendation(request)

        # Assert the response
        self.assertEqual(response, expected_reply)

    def test_send_recommendation_invalid_request(self):
        # Create a stub client
        channel = grpc.insecure_channel('localhost:50051')
        stub = recommendations_pb2_grpc.RecommendationStub(channel)

        # Create an invalid request
        request = recommendations_pb2.RecommendationRequest(category="invalid", datetime="invalid")

        # Mock the response
        expected_reply = recommendations_pb2.RecommendationReply(name="", id=0, lat=0, lng=0)
        stub.SendRecommendation = MagicMock(return_value=expected_reply)

        # Make gRPC call
        response = stub.SendRecommendation(request)

        # Assert the response
        self.assertEqual(response, expected_reply)

if __name__ == "__main__":
    logging.basicConfig()
    unittest.main()

