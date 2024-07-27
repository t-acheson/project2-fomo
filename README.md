# NYC FOMO - Community Engagement & Busyness Prediction

**NYC FOMO** is a web application designed to predict the busyness of areas in New York City (NYC) and enhance community interaction by helping users find and participate in local events. Built for the COMP47360 Research Practicum, the application evolved from identifying potential sites for pop-up retail stores to focusing on community engagement and social interaction.

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

## Setup & Installation

### Prerequisites

- Docker
- Node.js and npm
- GoLang
- Python

### Clone the Repository

```bash
git clone https://github.com/your-username/nyc-fomo.git
cd nyc-fomo
```
### API Keys and Environment Variables

You will need to set up the necessary API keys and environment variables. Create a `.env` file with the following keys:

#### `.env` file:

```makefile
SSH_HOST=
SSH_PORT=
SSH_USER=
SSH_PASSWORD=

POSTGRES_HOST=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_PORT=
```

## Frontend Setup

1. **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Start the frontend server:**

    ```bash
    npm start
    ```

## Backend Setup

1. **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2. **Install Go dependencies and build:**

    ```bash
    go mod tidy
    go build
    ```

3. **Run the backend server:**

    ```bash
    go run main.go
    ```

## Machine Learning Models

1. **Navigate to the machine learning directory:**

    ```bash
    cd data
    ```

2. **Install Python dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

3. **Run the model training and prediction scripts as needed.**

## Running with Docker

1. **Build and run Docker containers:**

    ```bash
    docker-compose up --build
    ```

2. **Access the application at [http://localhost:3000](http://localhost:3000).**

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


