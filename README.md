# NYC FOMO - Community Engagement & Busyness Prediction

**NYC FOMO** is a web application designed to predict the busyness of areas in New York City (NYC) and enhance community interaction by helping users find and participate in local events. Built for the COMP47360 Research Practicum, the application focuses on community engagement and social interaction.

<img width="1425" alt="image" src="https://github.com/user-attachments/assets/5bceac0f-1c43-4c7a-bb34-e208e2e6ccdf">


## Features

- **Real-Time Social Hotspots**: View a heat map showing social hotspots across NYC.
- **Anonymous Message Board**: Post and view comments about local events, tied to user locations for targeted community interaction.
- **Busyness Predictions**: Get predictions of busyness for various locations based on NYC Open Data, the Ticketmaster API, weather data, and sentiment analysis.

<img width="1437" alt="image" src="https://github.com/user-attachments/assets/06f1943c-a3c9-4195-9bf5-fffa240238b3">

<img width="1423" alt="image" src="https://github.com/user-attachments/assets/0b3840ab-287c-451a-8b00-76aa88624b12">



## Technologies Used

- **Frontend**: React, React-Bootstrap
- **Backend**: GoLang
- **Machine Learning**: Python
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Deployment**: GitHub Actions for CI/CD
- **Mapping**: OpenStreetMap, Leaflet

### Clone the Repository

```bash
git clone https://github.com/your-username/nyc-fomo.git
cd nyc-fomo
```
## Technologies Used

- **Frontend**: React, React-Bootstrap
- **Backend**: GoLang
- **Machine Learning**: Python
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Deployment**: GitHub Actions for CI/CD
- **Mapping**: OpenStreetMap, Leaflet

### Clone the Repository
```bash
git clone https://github.com/your-username/nyc-fomo.git
cd nyc-fomo
```
## Requirements

- **Operating System:** Linux Ubuntu Server
- **Software:** Docker

## Setup

1. **Configure Environment Variables:**
   - Navigate to the `config` directory.
   - Open `createEnvironmentVars.sh` and update the default environment variables to match your server and domain.

2. **Create Docker Network:**
   - Run `./createPostgisNetwork.sh` to create the Docker network required for microservices interfacing with PostgreSQL.

3. **Install SSL Certificate:**
   - Execute `./setupCertbot.sh` to follow a step-by-step guide for obtaining an SSL certificate for your domain. This will also place the certificate in the correct directory.
   - **Note:** Install `snap` if it's not already installed. For non-Ubuntu distributions, you may need to install Certbot using alternative methods.

## Running the Containers

1. **Start PostgreSQL Container:**
   - Run `./runPostgis.sh` to start the Docker container for PostgreSQL.
   - Check Docker logs to ensure each container is up and running before proceeding.

2. **Start Python gRPC Server:**
   - Run `./rungRPCServer.sh`.
   - Ensure that the necessary pickle file is generated and placed in the correct directory ([Choosing a Model](#choosing-a-model)).

3. **Build and Run Docker Compose:**
   - Run `docker-compose build` to build the static React pages.
   - Then, execute `docker-compose up -d` to load them into a volume for use by the Go server.
   - The application is now fully running. To take down the Docker compose, use `docker-compose down`.

## Rebuilding the Containers

- **After Updating React Files:**
  1. Run `docker-compose down`.
  2. Remove the volume storing the files in use by the Go server: `docker volume rm project2-fomo_frontend-build`.
  3. Rebuild and restart the containers: `docker-compose build` and `docker-compose up -d`.

## Updating the gRPC Server and Client

- **After Updating gRPC Server Proto Files:**
  - Run `./generategRPC.sh` in the `protos` directory to rebuild the necessary logic for use by the Python server and Go client.

## Choosing a Model

Two models are provided for use in the application:

1. **Random Forest Model:**
   - **File Size:** Large
   - **Prediction Quality:** Moderately good
   - **Load Time:** Fast on the Go server once deployed

2. **XGBoost Model:**
   - **File Size:** Smaller
   - **Prediction Quality:** Very accurate
   - **Load Time:** Slow to deploy

   **Recommendation:**
   - Use the Random Forest model for development.
   - Use the XGBoost model for production.

   **Creating Pickle Files:**
   1. Navigate to the `data` directory.
   2. Run the necessary scripts to generate pickle files.
   3. Move the generated pickle files to `python/grpc-server`.
   4. Update the Dockerfile with the name of the created pickle file.


## Deployment

Updates to the live application are managed using GitHub Actions. On each push to the main branch, the workflow:

1. SSHs into the server.
2. Updates the code with `git pull`.
3. Takes down the live Docker containers.
4. Rebuilds and restarts the containers with the updated code.

This process ensures a smooth deployment with minimal disruption.

## Testing

Unit tests cover the crucial major units of the application. To run tests:

1. **Frontend:**

    ```bash
    cd frontend
    npm test
    ```

2. **Backend:**

    ```bash
    cd backend
    go test ./...
    ```

3. **Machine Learning:**

    Run your model-specific tests as necessary.


## Contact

For more information, visit [nycfomo.com](http://nycfomo.com).


