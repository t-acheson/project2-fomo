import requests
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
import time

# API key
API_KEY = 'v6sN3JoEQ2v4sACGv22tpX78R9gCrWQa'
BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json'


DB_NAME = ''
DB_USER = ''
DB_PASS = ''
DB_HOST = ''
DB_PORT = '5432'


REQUESTS_PER_DAY = 4999
REQUESTS_PER_MINUTE = 99
SECONDS_PER_MINUTE = 60
SECONDS_PER_DAY = 24 * 60 * 60

daily_request_count = 0
minute_request_count = 0
last_request_time = time.time()

def fetch_events(city, country_code, api_key):
    global daily_request_count, minute_request_count, last_request_time
    
    current_time = time.time()
    

    elapsed_time = current_time - last_request_time
    
    
    if elapsed_time > SECONDS_PER_MINUTE:
        minute_request_count = 0
    
    
    if minute_request_count >= REQUESTS_PER_MINUTE:
        time_to_wait = SECONDS_PER_MINUTE - elapsed_time
        print(f"Rate limit per minute reached. Waiting for {time_to_wait:.2f} seconds.")
        time.sleep(time_to_wait)
        minute_request_count = 0
        last_request_time = time.time()
    
    
    if daily_request_count >= REQUESTS_PER_DAY:
        print("Rate limit per day reached. Waiting until next day.")
        time_to_wait = SECONDS_PER_DAY - (current_time % SECONDS_PER_DAY)
        time.sleep(time_to_wait)
        daily_request_count = 0
        minute_request_count = 0
        last_request_time = time.time()
    
    params = {
        'apikey': api_key,
        'city': city,
        'countryCode': country_code
    }
    
    response = requests.get(BASE_URL, params=params)
    
    daily_request_count += 1
    minute_request_count += 1
    last_request_time = time.time()
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None

def parse_events(data):
    events = data['_embedded']['events']
    event_list = []
    
    for event in events:
        venue = event['_embedded']['venues'][0]
        location = venue['location']
        event_info = {
            'name': event['name'],
            'date': event['dates']['start']['localDate'],
            'time': event['dates']['start'].get('localTime', 'TBA'),
            'venue': venue['name'],
            'city': venue['city']['name'],
            'latitude': location['latitude'],
            'longitude': location['longitude']
        }
        event_list.append(event_info)
    
    return event_list

def connect_to_db():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            port=DB_PORT
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def insert_events_to_db(events, conn):
    with conn.cursor() as cursor:
        query = """
        INSERT INTO events (name, date, time, venue, city, latitude, longitude)
        VALUES %s
        """
        values = [(e['name'], e['date'], e['time'], e['venue'], e['city'], e['latitude'], e['longitude']) for e in events]
        execute_values(cursor, query, values)
        conn.commit()

def main():
    city = 'New York'
    country_code = 'US'
    
    data = fetch_events(city, country_code, API_KEY)
    
    if data and '_embedded' in data:
        events = parse_events(data)
        
        conn = connect_to_db()
        if conn:
            insert_events_to_db(events, conn)
            conn.close()
        else:
            print("Failed to connect to the database.")
    else:
        print("No events found.")

if __name__ == "__main__":
    main()
