# Create client files
docker build -t go-gen --target client .
docker create --name temp-go go-gen
docker cp temp-go:/app/grpc-client/. ../go/grpc-client
docker rm -f temp-go
docker image rm go-gen

# Create server files
docker build -t python-gen --target server .
docker create --name temp-python python-gen
docker cp temp-python:/app/grpc-server/. ../python/grpc-server/
docker rm -f temp-python
docker image rm python-gen
