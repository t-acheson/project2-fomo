# Event Scraper - Ticketmaster API

#! Each time the following code is run change the pages to be scraped - avoid repeating same data scraping
#* Total 612 pages with 20 results per page
#* 5,000 limit per day - should only need to run this scraper 3 times to get all 12,233 events available

#! attempted to scrape - website says only supports retrieving up to the 1000th item

import requests
import psycopg2
from psycopg2.extras import execute_values
import time
import json
import pytz
from datetime import datetime, timedelta
from configdb import Postgres_CONFIG
import configkey

# API key
API_KEY = configkey.TMAPIKey_M
BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json'
params = {
    'apikey': API_KEY,
    'city': 'New York',
    'countryCode': 'US'
}

# Rate limiting variables
REQUESTS_PER_DAY = 4999
REQUESTS_PER_MINUTE = 99
SECONDS_PER_MINUTE = 60
SECONDS_PER_DAY = 24 * 60 * 60

daily_request_count = 0
minute_request_count = 0
last_request_time = time.time()

# Connect to PostgreSQL database
def connect_to_db():
    try:
        connection = psycopg2.connect(
            host=Postgres_CONFIG['host'],
            user=Postgres_CONFIG['user'],
            password=Postgres_CONFIG['password'],
            dbname=Postgres_CONFIG['dbname']
        )
        return connection
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

# Create events table if not already existing
def create_table(cursor):
    sql = """
    CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        datetime TIMESTAMP,
        venue VARCHAR(255),
        city VARCHAR(255),
        latitude FLOAT,
        longitude FLOAT
    );
    """
    try:
        #cursor.execute("DROP TABLE IF EXISTS events")
        cursor.execute(sql)
    except Exception as e:
        print(e)

# Retrieve events from Ticketmaster API
def fetch_events(city, country_code, api_key, start_page, end_page):
    global daily_request_count, minute_request_count, last_request_time
    events = []

    for page in range(start_page, end_page + 1):
        current_time = time.time()
        elapsed_time = current_time - last_request_time

        # Reset the minute counter if a minute has passed
        if elapsed_time > SECONDS_PER_MINUTE:
            minute_request_count = 0

        # Wait if the rate limit per minute is reached
        if minute_request_count >= REQUESTS_PER_MINUTE:
            time_to_wait = SECONDS_PER_MINUTE - elapsed_time
            print(f"Rate limit per minute reached. Waiting for {time_to_wait:.2f} seconds.")
            time.sleep(time_to_wait)
            minute_request_count = 0
            last_request_time = time.time()

        # Wait if the daily limit is reached
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
            'countryCode': country_code,
            'page': page,
            'size': 20
        }

        response = requests.get(BASE_URL, params=params)
        
        daily_request_count += 1
        minute_request_count += 1
        last_request_time = time.time()

        if response.status_code != 200:
            print(f"Error: {response.status_code}")
            try:
                print(response.json())
            except:
                pass
            break

        data = response.json()

        if '_embedded' in data and 'events' in data['_embedded']:
            events.extend(data['_embedded']['events'])
        else:
            break

        if page >= data['page']['totalPages']:  # Don't exceed the total number of pages - 612
            break

        time.sleep(0.1)  # To avoid hitting the rate limit

    return events

# Parse events data
def parse_events(events_data):
    event_list = []

    for event in events_data:
        venue = event['_embedded']['venues'][0]
        location = venue['location']
        event_info = {
            'name': event['name'],
            'datetime': event['dates']['start']['localDate'] + ' ' + event['dates']['start'].get('localTime', '00:00:00'),
            'venue': venue['name'],
            'city': venue['city']['name'],
            'latitude': location['latitude'],
            'longitude': location['longitude']
        }
        event_list.append(event_info)

    return event_list

# Insert events into the database
def insert_events_to_db(events, connection):
    cursor = connection.cursor()
    query = """
    INSERT INTO events (name, datetime, venue, city, latitude, longitude)
    VALUES %s
    """
    values = [(e['name'], e['datetime'], e['venue'], e['city'], e['latitude'], e['longitude']) for e in events]
    execute_values(cursor, query, values)
    connection.commit()
    cursor.close()

# Main function to execute all previous functions
def main():
    city = 'New York'
    country_code = 'US'

    # Define start and end pages for the event search
    start_page = 50
    end_page = 51

    print("Retrieving events")
    events_data = fetch_events(city, country_code, API_KEY, start_page, end_page)

    if events_data:
        print("Parsing events")
        events = parse_events(events_data)

        print("Connecting to database")
        conn = connect_to_db()
        if conn:
            cursor = conn.cursor()
            create_table(cursor)
            print("Inserting events into database")
            insert_events_to_db(events, conn)
            conn.close()
        else:
            print("Failed to connect to the database.")
    else:
        print("No events found.")

# Execute main
if __name__ == "__main__":
    main()
