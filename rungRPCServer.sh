docker build -t python_grpc_server_image python/grpc-server/.

docker run -d \
  --name python_grpc_server \
  --restart always \
  --network pg_network \
  -p 50050:50051 \
  python_grpc_server_image
