# FOURSQUARE SCRAPER

#* Code is the same as FoursquareScrape_Postgres.py, but here I am trying to only retrieve tips from 2022 onwards

# 90 neighbourhoods subsampled for out purposes
#TODO run initially by incrementing the neighbourhoods - run 5 or 10 times changing the neighbourhoods each time

# New York Boroughs
boroughs = [
    "manhattan", "bronx", "statenIsland", "brooklyn", "queens"
]

#! Uncomment different neighbourhoods for each new API call to ensure we're getting different and varied results

# Manhattan neighborhoods
manhattan = [
    #"Battery Park City", 
    #"Carnegie Hill", "East Harlem", 
    "Financial District", "Gramercy", "Hamilton Heights",
    #"Inwood", "Lenox Hill", "Manhattan Valley", 
    #"NoHo", "Roosevelt Island", "SoHo", 
    "Times Square",#"Union Square", "Wall Street",
    #"Yorkville", "Beekman Place", "Chelsea",
    "East Village", "Flatiron", "Greenwich Village"
]

# Bronx neighborhoods
bronx = [
    #"Allerton", 
    #"Bathgate", "Castle Hill", 
    #"East Tremont", "Fieldston", "High Bridge",
    #"Kingsbridge", "Longwood", "Marble Hill", 
    #"North Riverdale", "Olinville", "Parkchester",
    #"Riverdale", "Schuylerville", "Throgs Neck", 
    #"Unionport", "Van Nest", "Wakefield",
    #"Baychester", "City Island", "Eastchester"
]

# Staten Island neighborhoods
statenIsland = [
    #"Annadale", 
    #"Bay Terrace", "Castleton Corners", "Dongan Hills", 
    #"Egbertville", "Fox Hills", "Graniteville", "Heartland Village", 
    #"Lighthouse Hill", "Manor Heights", "New Brighton", 
    #"Oakwood", "Park Hill", "Randall Manor", 
    #"Sandy Ground", "Todt Hill", "Ward Hill", 
    #"Arden Heights", "Bloomfield", "Charleston",
    #"Elm Park", "Grant City", "Howland Hook"
]

# Brooklyn neighborhoods
brooklyn = [
    #"Bath Beach", 
    #"Canarsie", "Ditmas Park", "East Flatbush", 
    #"Farragut", "Georgetown", "Highland Park", "Kensington", 
    #"Manhattan Beach", "Navy Yard", "Ocean Hill", 
    #"Paerdegat Basin", "Red Hook", "Sea Gate", 
    #"Tompkins Park North", "Vinegar Hill", "Weeksville", 
    #"Bay Ridge", "Carroll Gardens", "Downtown", 
    #"East New York", "Flatbush", "Gerritsen Beach"
]

# Queens neighborhoods
queens = [
    #"Arverne", 
    #"Bay Terrace", "Cambria Heights", "Douglaston", "East Elmhurst", 
    #"Far Rockaway", "Glen Oaks", "Hammels", "Jackson Heights", "Kew Gardens", 
    #"Laurelton", "Malba", "Neponsit", 
    #"Oakland Gardens", "Pomonok", "Queens Village", 
    #"Ravenswood", "Seaside", "Utopia", 
    #"Whitestone", "Astoria", "Bayside", 
    #"Clearview", "Dutch Kills", "Edgemere"
]

# Foursquare categories - events
categories = [
    #"16000",   #Landmarks and Outdoors
    #"14000",   #Event
    "14004", # Event > Entertainment Event > Festival
    "14005", # Event > Entertainment Event > Music Festival
    "14006", # Event > Entertainment Event > Parade
    "14007", # Event > Entertainment Event > Sporting Event
    "14010", # Event > Marketplace > Christmas Market
    "14011", # Event > Marketplace > Stoop Sale
    "14012", # Event > Marketplace > Street Fair
    "14013", # Event > Marketplace > Street Food Gathering
    "14014", # Event > Marketplace > Trade Fair
    "14015", # Event > Other Event
    
]

import json
import psycopg2
import requests
import time
import traceback
import datetime
import pytz 
from sshtunnel import SSHTunnelForwarder
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get variables from environment
SSH_HOST = os.getenv('SSH_HOST')
SSH_PORT = int(os.getenv('SSH_PORT'))
SSH_USER = os.getenv('SSH_USER')
SSH_PASSWORD = os.getenv('SSH_PASSWORD')

POSTGRES_HOST = os.getenv('POSTGRES_HOST')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_DB = os.getenv('POSTGRES_DB')
POSTGRES_PORT = int(os.getenv('POSTGRES_PORT'))

# Connect to PostgreSQL database via SSH tunnel
tunnel = SSHTunnelForwarder(
    (SSH_HOST, SSH_PORT),
    ssh_username=SSH_USER,
    ssh_password=SSH_PASSWORD,
    remote_bind_address=(POSTGRES_HOST, POSTGRES_PORT),
    local_bind_address=('127.0.0.1', 5433)
)
tunnel.start()

connection = psycopg2.connect(
    database=POSTGRES_DB,
    user=POSTGRES_USER,
    password=POSTGRES_PASSWORD,
    host='127.0.0.1',
    port=tunnel.local_bind_port
)

cursor = connection.cursor()

# Can close the cursor and connection with below commands
# cursor.close()
# connection.close()

# Create table for New York weather data
# sql = """
# CREATE TABLE IF NOT EXISTS events_fs (
#     id SERIAL PRIMARY KEY,
#     name VARCHAR(255),
#     address VARCHAR(255),
#     comment TEXT,
#     created_at TIMESTAMP,
#     latitude FLOAT,
#     longitude FLOAT
# );
# """

# Create table for New York events data
sql = """
CREATE TABLE IF NOT EXISTS events_fs_2023 (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    created_at TIMESTAMP,
    latitude FLOAT,
    longitude FLOAT
);
"""
#created_at TIMESTAMP,

try:
    #Drop table if table Comments already exists
    cursor.execute("DROP TABLE IF EXISTS events_fs")
    #Create new table - with above commented out, new table only created if doesn't exist
    cursor.execute(sql)
    #Save the changes made to schema
    connection.commit()
except Exception as e:
    #print out error message
    print(e)
    
# start: function to commit values to Comments table previously created
def events_to_db(name, address, created_at, latitude, longitude): # created_at,
    # Convert created_at to useable datetime format 
    if created_at is not None:
        created_at = datetime.datetime.strptime(created_at, '%Y-%m-%dT%H:%M:%S.%fZ')
        
    vals = (name, address, created_at, latitude, longitude) # created_at,
    
    # Insert into table - list name, address etc. again to specify the column heading of table to insert vals into
    cursor.execute("INSERT INTO events_fs_2023 (name, address, created_at, latitude, longitude) VALUES (%s, %s, %s, %s, %s)", vals)
    connection.commit()
# end : function to commit Comments to database
                        
# Define parameters for API i.e. API key
headers = {
    "accept": "application/json",
    "Authorization": os.getenv('FoursquareAPIKey')
}

# Initialise empty list for data responses from each borough
responses = []

# Set a delay time in seconds to wait between each API call
delay = 5


#TODO update limit on URLs to max 50, was set to 1/2 for testing
# Initialise for loop to iterate through boroughs
for borough in boroughs:
    if borough == "manhattan":
        # Initialise for loop to iterate through manhattan neighbourhoods
        for m in manhattan:
            #Initialise for loop to iterate through categories
            for category in categories:
                # use string to insert each iterable of category and m into the url
                url = f"https://api.foursquare.com/v3/places/search?categories={category}&fields=name%2Ctips%2Clocation&near={m}%2CNY&limit=50"
                responsem = requests.get(url, headers=headers)
                data1 = responsem.json()
                # Add API response data (stored in variable data1) to responses list
                responses.append(data1)
                print("Please wait... retrieving data for Manhattan neighborhoods")
                #time.sleep(delay)  # Wait before the next API call
                
    # what follows is the same as above for each of the remaining boroughs and their associated neighbourhoods            
    elif borough == "bronx":
        for br in bronx:
            for category in categories:
                url = f"https://api.foursquare.com/v3/places/search?categories={category}&fields=name%2Ctips%2Clocation&near={br}%2CNY&limit=50"
                responsebr = requests.get(url, headers=headers)
                data2 = responsebr.json()
                responses.append(data2)
                print("Please wait... retrieving data for Bronx neighborhoods")
                #time.sleep(delay)
    
    elif borough == "statenIsland":
        for s in statenIsland:
            for category in categories:
                url = f"https://api.foursquare.com/v3/places/search?categories={category}&fields=name%2Ctips%2Clocation&near={s}%2CNY&limit=50"
                responseS = requests.get(url, headers=headers)
                data3 = responseS.json()
                responses.append(data3)
                print("Please wait... retrieving data for Staten Island neighborhoods")
                #time.sleep(delay)
    
    elif borough == "brooklyn":
        for b in brooklyn:
            for category in categories:
                url = f"https://api.foursquare.com/v3/places/search?categories={category}&fields=name%2Ctips%2Clocation&near={b}%2CNY&limit=50"
                responseb = requests.get(url, headers=headers)
                data4 = responseb.json()
                responses.append(data4)
                print("Please wait... retrieving data for Brooklyn neighborhoods")
                #time.sleep(delay)
    
    elif borough == "queens":
        for q in queens:
            for category in categories:
                url = f"https://api.foursquare.com/v3/places/search?categories={category}&fields=name%2Ctips%2Clocation&near={q}%2CNY&limit=50"
                responseq = requests.get(url, headers=headers)
                data5 = responseq.json()
                responses.append(data5)
                print("Please wait... retrieving data for Queens neighborhoods")
                #time.sleep(delay)

# uncomment below to visualise code response
#print(responsem.text, responsebr.text)

# Initialise for loop to iterate through the data elements in responses list
for data in responses:
    # Initialise for loop iterating through results in each data element
    for result in data.get('results', []):
                # Extract specific data to be inserted into table
                name = result.get('name')
                address = result['location'].get('formatted_address')
                latitude = data['context']['geo_bounds']['circle']['center']['latitude']
                longitude = data['context']['geo_bounds']['circle']['center']['longitude']

                # if tips are in data response, extract tips info and insert into Comments table
                if 'tips' in result:
                    for tip in result['tips']:
                        created_at = tip.get('created_at')
                        if created_at:
                            # Filter out events before 2022
                            created_at_date = datetime.datetime.strptime(created_at, '%Y-%m-%dT%H:%M:%S.%fZ')
                            if created_at_date.year >= 2022:
                                # Call events_to_db function to insert data into table
                                events_to_db(name, address, created_at, latitude, longitude)
                else:
                    events_to_db(name, address, None, latitude, longitude)

# Can close the cursor and connection with below commands
cursor.close()
connection.close()
