import pickle
import pandas as pd
from datetime import datetime, timedelta
import pytz
import sys
import json 
import xgboost as xgb
import numpy as np
import psycopg2
import os
from dotenv import load_dotenv
from sshtunnel import SSHTunnelForwarder

# Load environment variables
load_dotenv()

# Database and SSH credentials
SSH_HOST = os.getenv('SSH_HOST')
SSH_PORT = int(os.getenv('SSH_PORT'))
SSH_USER = os.getenv('SSH_USER')
SSH_PASSWORD = os.getenv('SSH_PASSWORD')

POSTGRES_HOST = os.getenv('POSTGRES_HOST')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_DB = os.getenv('POSTGRES_DB')
POSTGRES_PORT = int(os.getenv('POSTGRES_PORT'))


# Load model
try:
    with open('/Users/muireannoconnor/Desktop/SummerProject/xgb_model.pkl', 'rb') as file:
        model = pickle.load(file)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")

# New York timezone
ny_tz = pytz.timezone('America/New_York')

# Busyness labels
label_mapping = {
    0: 'Quiet',
    1: 'Not Busy',
    2: 'A Little Busy',
    3: 'Busy',
    4: 'Very Busy',
    5: 'Extremely Busy'
}

# Start: function to fetch most recent weather data from Postgres database
def fetch_weather(locationid):
    # Connect to PostgreSQL
    with SSHTunnelForwarder(
        (SSH_HOST, SSH_PORT),
        ssh_username=SSH_USER,
        ssh_password=SSH_PASSWORD,
        remote_bind_address=(POSTGRES_HOST, POSTGRES_PORT),
        local_bind_address=('127.0.0.1', 5433)
    ) as tunnel:
        connection = psycopg2.connect(
            database=POSTGRES_DB,
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD,
            host='127.0.0.1',
            port=tunnel.local_bind_port
        )

        query = """
        SELECT * FROM weather_NY
        WHERE dt = (SELECT MAX(dt) FROM weather_NY);
        """

        with connection.cursor() as cursor:
            cursor.execute(query)
            result = cursor.fetchone()
    
    if result:
        weather_data = {
            'dt': result[0],
            'weather': result[1],
            'temperature_2m (°C)': result[2],
            'feels_like': result[3],
            'windspeed_10m (km/h)': result[4],
            'winddirection_10m (°)': result[5],
            'pressure': result[6],
            'humidity': result[7],
            'clouds': result[8],
            'rain_1h': result[9],
            'rain_3h': result[10],
            'snow_1h': result[11],
            'snow_3h': result[12]
        }
        #print(weather_data)
        return weather_data
    else:
        raise ValueError("No weather data found")
# end: function fetching current weather from postgres

# Start: define function checking if event is happening on given date within an hour of given time 
def check_event_on(check_datetime):
    print(f"Checking for events on {check_datetime}...")
    
    # Connect to PostgreSQL
    with SSHTunnelForwarder(
        (SSH_HOST, SSH_PORT),
        ssh_username=SSH_USER,
        ssh_password=SSH_PASSWORD,
        remote_bind_address=(POSTGRES_HOST, POSTGRES_PORT),
        local_bind_address=('127.0.0.1', 5433)
    ) as tunnel:
        connection = psycopg2.connect(
            database=POSTGRES_DB,
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD,
            host='127.0.0.1',
            port=tunnel.local_bind_port
        )
        
        cursor = connection.cursor()
        
        # Check for events within an hour of datetime
        query = """
        SELECT COUNT(*) FROM events
        WHERE datetime >= %s AND datetime < %s
        """
        
        one_hour_after = check_datetime + timedelta(hours=1)
        cursor.execute(query, (check_datetime, one_hour_after))
        
        count = cursor.fetchone()[0]
        cursor.close()
        connection.close()
        
    print(f"Number of events found: {count}")
    return count > 0
# end: function checking if event on date yes/no

# Start: define function to map predicted ridership to busyness category
def ridership_to_category(raw_prediction):
    if raw_prediction <= 16:
        return 1  # Quiet value
    elif raw_prediction <= 130:
        return 2  # Not Too Busy
    elif raw_prediction <= 417:
        return 3  # A Little Busy
    elif raw_prediction <= 1236:
        return 4  # Busy
    elif raw_prediction <= 12984:
        return 5  # Very Busy
    else:
        return 6  # Extremely Busy
# End: function mapping ridership to busyness category

# Start: define function to call inputs and model to output predicted busyness
def predict_busyness(locationid):
    # Fetch the latest weather data
    weather_data = fetch_weather(locationid)

    # Current datetime - New York
    now = datetime.now(ny_tz)
    
    # Datetime for 1 hour from now
    future_time = now + timedelta(hours=1)
    
    # Extract hour, day of week, and month - values model is trained on
    hour = future_time.hour
    day = future_time.day
    month = future_time.month
    #weekday = future_time.weekday()
    year = future_time.year
    
    # Check if there is an event
    has_event = check_event_on(future_time)
    events = 1 if has_event else 0
    
    print(f"Future time: {future_time}")
    print(f"Event status: {'Event happening' if has_event else 'No event'}")
    
    # Input features
    input_data = pd.DataFrame({
        'locationid': [locationid],
        'year': [year],
        'month': [month],
        'day': [day],
        'hour': [hour],
        #'weekday': [weekday]
        
        'temperature_2m (°C)': [weather_data['temperature_2m (°C)']],
        'windspeed_10m (km/h)': [weather_data['windspeed_10m (km/h)']],
        'winddirection_10m (°)': [weather_data['winddirection_10m (°)']],
        'sentiment': [1],
        'events': [events],
        
    })
    
    input_data['locationid'] = input_data['locationid'].astype('float64')
    input_data['hour'] = input_data['hour'].astype('float64')
    input_data['day'] = input_data['day'].astype('int32')
    input_data['month'] = input_data['month'].astype('int32')
    input_data['temperature_2m (°C)'] = input_data['temperature_2m (°C)'].astype('float32')
    input_data['windspeed_10m (km/h)'] = input_data['windspeed_10m (km/h)'].astype('float32')
    input_data['winddirection_10m (°)'] = input_data['winddirection_10m (°)'].astype('float32')
    input_data['sentiment'] = input_data['sentiment'].astype('float64')
    input_data['events'] = input_data['events'].astype('int64')
    input_data['year'] = input_data['year'].astype('float64')

    
    # Predict
    try:
        raw_prediction = model.predict(input_data)
        # replace negatives with 0
        raw_prediction = np.maximum(raw_prediction, 0) 
        print("Raw prediction:", raw_prediction)
        
        # Map predicted ridership to busyness category
        busyness_category = ridership_to_category(raw_prediction[0])
        print("Busyness category:", busyness_category)
        
    except Exception as e:
        print(f"Error making prediction: {e}")
        sys.exit(1)
    
    return busyness_category
# End function returning predicted busyness

# Test the prediction function
#locationid = 6
#predicted_busyness = predict_busyness(location_id)
#print(f"Predicted busyness at location {location_id} 1 hour from now in New York: {predicted_busyness}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python predict_busyness.py <location_id>")
        sys.exit(1)

    location_id = int(sys.argv[1])
    busyness = predict_busyness(location_id)
    print(json.dumps({"busyness": busyness}))
    
    
    
# Quantiles for data used in training model  
# Number of entries in each ridership range:
# Quiet: 636968
# Not Too Busy: 651967
# A Little Busy: 644018
# Busy: 644902
# Very Busy: 612598
# Extremely Busy: 32229

# Quiet: 1
# Not Too Busy: 2
# A Little Busy: 3
# Busy: 4
# Very Busy: 5
# Extremely Busy: 6

# Ranges used for each category:
# Quiet: 0 - 16
# Not Too Busy: 17 - 130
# A Little Busy: 131 - 417
# Busy: 418 - 1236
# Very Busy: 1237 - 12984
# Extremely Busy: 12985 - 65536