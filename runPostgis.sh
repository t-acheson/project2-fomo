docker run -d \
  --name postgres-container \
  --network pg_network \
  -e POSTGRES_PASSWORD=$PG_PASSWORD \
  -e POSTGRES_USER=$PG_USERNAME \
  -e POSTGRES_DB=$PG_DATABASE \
  -p 5432:5432 \
  -v ~/PG_DATA:/var/lib/postgresql/data \
  --restart always \
  postgis/postgis
