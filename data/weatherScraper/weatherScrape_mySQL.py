#! Just for scraping into mySQL database - using it for testing when changing things around
import json
import mysql.connector
import requests
import time
import traceback
import datetime
import pytz 
from configdb import MySQL_CONFIG

# Define API keys and URLs for weather data
currentAPIKey='3edcf35031286bacd6cb00d304e78fea'
currentAPIURL='https://api.openweathermap.org/data/2.5/weather?'
#currentAPIURL='https://api.openweathermap.org/data/2.5/weather'
#currentParams={'lat': 53.344, 'lon': -6.2672, 'appid': currentAPIKey} # For Dublin
#currentParams={'lat': 43.0004, 'lon': -75.4999, 'appid': currentAPIKey} # For New York
currentParams={'id': 5128638, 'appid': currentAPIKey} # For New York

response = requests.get(currentAPIURL, params=currentParams)

if response.status_code == 200:
    json.loads(response.text)

    data = response.json()
    
    print(data)
    
else:
    print(f"Error {response.status_code}: {response.json()}")


# Connect to the relevant database server - currently local mySQL
connection = mysql.connector.connect(
    host= MySQL_CONFIG['host'],
    user= MySQL_CONFIG['user'],
    password= MySQL_CONFIG['password']
)

# create cursor object - with previous connection
# can now execute SQL queries - interface to interact with database
cursor = connection.cursor()

# Create new database/schema named "summer" - if it doesn't already exist
cursor.execute("CREATE DATABASE IF NOT EXISTS summer;")

# close the cursor
cursor.close()
# Close the connection as want to reopen and specify schema
connection.close()


# Connect to the database server again
# Now specifying "summer" schema
connection = mysql.connector.connect(
    host= MySQL_CONFIG['host'],
    user= MySQL_CONFIG['user'],
    password= MySQL_CONFIG['password'],
    database="summer"
)

#create cursor object - with above database connection
cursor = connection.cursor()

# Can close the cursor and connection with below commands
# cursor.close()
# connection.close()


# Create table for New York weather data
sql = """
CREATE TABLE IF NOT EXISTS weather_NY(
dt DATETIME NOT NULL,
weather VARCHAR (256),
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


try:
    #Drop table if table weather_NY already exists
    #cursor.execute("DROP TABLE IF EXISTS weather_NY")
    #Create new table - with above commented out, new table only created if doesn't exist
    cursor.execute(sql)
    #Save the changes made to schema
    connection.commit()
    #Fetch results - should be empty - just to see code execution
    print(cursor.fetchall())
except Exception as e:
    #print out error message
    print(e)


def weather_to_db(text):
    weather = json.loads(text)
    
    # Need to get datetime in New York - just datetime = Irish time
    ny_tz = pytz.timezone('America/New_York') # Looking for New York timezone
    now = datetime.datetime.now(ny_tz)
    
    weather_main = str(weather['weather'][0]['main'])
    
    # Extract temperature information and convert to celcius
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

    # Print the extracted weather information - for visualisation (can be removed)
    print(f"Datetime: {now}, Weather: {weather_main}, Temperature: {temperature_celsius}C, Feels like: {feels_celsius}C, Wind Speed: {wind_speed}, Wind Direction (degrees): {wind_degrees}, Pressure: {pressure}, Humidity: {humidity}%, Cloudiness: {clouds}%, Rain volume last hr: {rain_1h}mm, Rain volume last 3hrs: {rain_3h}mm, Snow volume last hr: {snow_1h}mm, Snow volume last 3hrs: {snow_3h}mm,")
    
    # Insert values into table
    vals = (now, weather_main, temperature_celsius, feels_celsius, wind_speed, wind_degrees, pressure, humidity, clouds, rain_1h, rain_3h, snow_1h, snow_3h)
    cursor.execute("INSERT INTO weather_NY VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", vals)
    connection.commit() 
    

# defining main function to call weather_to_db
def main():
    while True:#start infinite loop
        try:
            # retrieve current weather data from weather API - store in variable
            wresponse = requests.get(currentAPIURL, params=currentParams)
            print(wresponse)
            
            # call current weather to db function with text content from weather API - passes retrieved weather data into db
            weather_to_db(wresponse.text)
            
        except:
            print(traceback.format_exc())# prints errors
        
        # Wait for 5 minutes before fetching data again
        #time.sleep(5*60) #every 5 mins
        time.sleep(1*60) # for testing
    return

main() # execute the program


