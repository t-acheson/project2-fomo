# POSTGRES WEATHER SCRAPER

#TODO timezone for Datetime; in code converts to NY timezone, prints out correctly and populates mySQL correctly
#TODO contd: Datetime does not retain conversion when pulled into Postgres - I don't know why
#* Now inserts correctly in Postgres but entered as string, unsure if that is acceptable

#! This code creates a database called summer and a table called weather_NY
#! This may need to be removed when putting on server
import json
import psycopg2  # Import psycopg2 for PostgreSQL
import requests
import time
import traceback
import datetime
import pytz
from configdb import Postgres_CONFIG
import configkey

# Define API keys and URLs for weather data
currentAPIKey = configkey.currentAPIKey
currentAPIURL = 'https://api.openweathermap.org/data/2.5/weather?'
currentParams = {'id': 5128638, 'appid': currentAPIKey}  # For New York

response = requests.get(currentAPIURL, params=currentParams)

if response.status_code == 200:
    data = response.json()
    print(data)
else:
    print(f"Error {response.status_code}: {response.json()}")

# Connect to the relevant PostgreSQL database
#connection = psycopg2.connect(
 #   host= Postgres_CONFIG['host'],
  #  user= Postgres_CONFIG['user'], 
   # password= Postgres_CONFIG['password'],
    #dbname= Postgres_CONFIG['dbname'] 
#)

# Create cursor object - with previous connection
#cursor = connection.cursor()

#! Create new database/schema named "summer" - if it doesn't already exist
#cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'summer'")
#exists = cursor.fetchone()
#if not exists:
    #cursor.execute("CREATE DATABASE summer")

# Close the cursor and connection
#cursor.close()
#connection.close()

# Connect to the new database "summer"
connection = psycopg2.connect(
    host= Postgres_CONFIG['host'],
    user= Postgres_CONFIG['user'], 
    password= Postgres_CONFIG['password'],
    dbname= Postgres_CONFIG['dbname'] 
)

#! Create cursor object - with above database connection
cursor = connection.cursor()

# Set the time zone to New York for the PostgreSQL session
cursor.execute("SET TIMEZONE='America/New_York';")

# Create table for New York weather data
sql = """
CREATE TABLE IF NOT EXISTS weather_NY(
dt TEXT NOT NULL,
weather VARCHAR(256),
temperature FLOAT,
feels_like FLOAT,
wind_speed FLOAT,
wind_degrees FLOAT,
pressure FLOAT,
humidity INTEGER,
clouds INTEGER,
rain_1h FLOAT,
rain_3h FLOAT,
snow_1h FLOAT,
snow_3h FLOAT,
PRIMARY KEY (dt)
)
"""

#dt TIMESTAMPTZ NOT NULL,

try:
    # Create new table - with above commented out, new table only created if doesn't exist
    cursor.execute(sql)
    # Save the changes made to schema
    connection.commit()
except Exception as e:
    # Print out error message
    print(e)

# start : function to extract relevant weather variables from API and commit to database
def weather_to_db(text):
    weather = json.loads(text)
    
    # Extract the datetime from the weather API and convert it to the New York timezone
    utc_time = datetime.datetime.utcfromtimestamp(weather['dt']).replace(tzinfo=pytz.utc)
    #now = datetime.datetime.utcfromtimestamp(weather['dt']).replace(tzinfo=pytz.utc)

    ny_tz = pytz.timezone('America/New_York')  # Looking for New York timezone
    now = utc_time.astimezone(ny_tz)
    now_str = now.strftime('%Y-%m-%d %H:%M:%S %Z')
    
    weather_main = str(weather['weather'][0]['main'])
    
    # Extract temperature information and convert to Celsius
    temperature_kelvin = weather['main']['temp']
    temperature_celsius = float(temperature_kelvin - 273.15)  # Convert Kelvin to Celsius
    
    feels_kelvin = weather['main']['feels_like']
    feels_celsius = float(feels_kelvin - 273.15)
    
    wind_speed = float(weather['wind']['speed'])
    
    wind_degrees = int(weather['wind']['deg'])
    
    pressure = int(weather['main']['pressure'])
    
    humidity = int(weather['main']['humidity'])
    
    clouds = int(weather['clouds']['all'])
    
    # Using get method so values will return as zero if they don't exist in the API
    # Rain and snow values are not always available from open weather API - if not raining they don't exist
    rain_1h = float(weather.get('rain', {}).get('1h', 0))
    rain_3h = float(weather.get('rain', {}).get('3h', 0))
    snow_1h = float(weather.get('snow', {}).get('1h', 0))
    snow_3h = float(weather.get('snow', {}).get('3h', 0))

    # Print the extracted weather information - for visualization (can be removed)
    print(f"Datetime: {now}, Weather: {weather_main}, Temperature: {temperature_celsius}C, Feels like: {feels_celsius}C, Wind Speed: {wind_speed}, Wind Direction (degrees): {wind_degrees}, Pressure: {pressure}, Humidity: {humidity}%, Cloudiness: {clouds}%, Rain volume last hr: {rain_1h}mm, Rain volume last 3hrs: {rain_3h}mm, Snow volume last hr: {snow_1h}mm, Snow volume last 3hrs: {snow_3h}mm,")
    
    # Insert values into table
    vals = (now, weather_main, temperature_celsius, feels_celsius, wind_speed, wind_degrees, pressure, humidity, clouds, rain_1h, rain_3h, snow_1h, snow_3h)
    cursor.execute("INSERT INTO weather_NY VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", vals)
    connection.commit() 
# end : weather variables extraction and commit to database function


# start : Defining main function to call weather API and weather_to_db function
def main(scrape_continuously=False):
    while True:  # Start infinite loop
        try:
            # Retrieve current weather data from weather API - store in variable
            wresponse = requests.get(currentAPIURL, params=currentParams)
            print(wresponse)
            
            # Call current weather to db function with text content from weather API - passes retrieved weather data into db
            weather_to_db(wresponse.text)
            
        except:
            print(traceback.format_exc())  # Prints errors
        
        if not scrape_continuously:
            break
        
        # Wait for 15 minutes before fetching data again
        # time.sleep(5*60) #every 5 mins
        #time.sleep(15*60)  # for testing make smaller
    return
# end : main function


if __name__ == "__main__":
    main(scrape_continuously=False)
