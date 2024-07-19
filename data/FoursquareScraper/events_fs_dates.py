# FOURSQUARE SCRAPER

#* Code is the same as FoursquareScrape_Postgres.py, but here I am trying to only retrieve events with dates

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
    #"Financial District", "Gramercy", "Hamilton Heights",
    #"Inwood", "Lenox Hill", "Manhattan Valley", 
    #"NoHo", "Roosevelt Island", "SoHo", 
    #"Times Square", "Union Square", "Wall Street",
    #"Yorkville", "Beekman Place", "Chelsea",
    #"East Village", "Flatiron", "Greenwich Village",
    #"Chinatown", "Civic Center", "Clinton",
    #"Herald Square", "Hudson Square", "Harlem",
    #"Lincoln Square", "Little Italy", "Lower East Side",
    #"Manhattanville", "Midtown", "Midtown South",
    #"Morningside Heights", "Murray Hill", "South Village",
    #"Stuyvesant Town", "Sutton Place", "Tribeca",
    #"Tudor City", "Turtle Bay", "Upper East Side",
    #"Upper West Side", "Washington Heights", "West Village"
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
    #"Baychester", "City Island", "Eastchester",
    #"Bedford Park", "Belmont", "Bronxdale",
    #"Bronx Park South", "Bronx River", "Claremont Village",
    #"Clason Point", "Concourse", "Concourse Village",
    #"Co-op City", "Country Club", "Edenwald",
    #"Edgewater Park", "Fordham", "Hunts Point", 
    #"Kingsbridge Heights", "Melrose", "Morris Heights",
    #"Morris Park", "Morrisania", "Mott Haven", 
    #"Mount Eden", "Mount Hope", "Norwood",
    #"Pelham Bay", "Pelham Gardens", "Pelham Parkway",
    #"Port Morris", "Soundview", "Spuyten Duyvil",
    #"University Heights", "West Farms", "Westchester Square", 
    #"Williamsbridge", "Woodlawn"
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
    #"Elm Park", "Grant City", "Howland Hook",
    #"Arlington", "Arrochar", "Bulls Head",
    #"Butler Manor", "Clifton", "Concord",
    #"Chelsea", "Eltingville", "Emerson Hill",
    #"Grasmere", "Great Kills", "Greenridge",
    #"Grymes Hill", "Huguenot", "Livingston",
    #"Mariner's Harbor", "Midland Beach", "New Dorp",
    #"New Dorp Beach", "New Springville", "Old Place",
    #"Old Town", "Pleasant Plains", "Port Ivory",
    #"Port Richmond", "Prince's Bay", "Richmond Town", 
    #"Richmond Valley", "Rosebank", "Rossville", 
    #"Shore Acres", "Silver Lake", "South Beach",
    #"St. George", "Stapleton", "Sunnyside",
    #"Tompkinsville", "Tottenville", "Travis",
    #"Westerleigh", "Willowbrook", "Woodrow"
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
    #"East New York", "Flatbush", "Gerritsen Beach",
    #"Bedford Stuyvesant", "Bensonhurst", "Boerum Hill",
    #"Borough Park", "Brighton Beach", "Brooklyn Heights",
    #"Brownsville", "Bushwick", "City Line",
    #"Clinton Hill", "Cobble Hill", "Coney Island",
    #"Crown Heights", "Cypress Hills", "DUMBO",
    #"Dyker Heights", "East Williamsburg", "Flatlands",
    #"Fort Greene", "Fort Hamilton", "Fulton Ferry",
    #"Gowanus", "Gravesend", "Greenpoint",
    #"Homecrest", "Kings Highway", "Manhattan Terrace",
    #"Mapleton", "Marine Park", "Midwood",
    #"Mill Basin", "Mill Island", "New Lots",
    #"North Side", "Ocean Parkway", "Park Slope",
    #"Plum Beach", "Prospect Heights", "Prospect Lefferts Gardens",
    #"Prospect Park South", "Remsen Village", "Rugby",
    #"South Side", "Sheepshead Bay", "Spring Creek",
    #"Starrett City", "Stuyvesant Heights", "Sunset Park",
    #"West Brighton", "Williamsburg", 
    #"Windsor Terrace", "Wingate"
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
    #"Astoria Heights", "Auburndale", "Bayswater",
    #"Beechhurst", "Bellaire", "Belle Harbor",
    #"Bellerose", "Blissville", "Breezy Point",
    #"Brookville", "Briarwood", "Broad Channel",
    #"College Point", "Elmhurst", "Floral Park",
    #"Flushing", "Forest Hills", "Forest Hills Gardens", 
    #"Fresh Meadows", "Glendale", "Hillcrest",
    #"Holliswood", "Hollis", "Howard Beach",
    #"Hunters Point", "Jamaica", "Jamaica Center",
    #"Jamaica Estates", "Jamaica Hills", "Kew Gardens Hills",
    #"Lefrak City", "Little Neck", "Long Island City",
    #"Lindenwood", "Maspeth", "Middle Village",
    #"Murray Hill", "North Corona", "New Hyde Park",
    #"Ozone Park", "Queensboro Hill", "Rego Park",
    #"Richmond Hill", "Ridgewood", "Rochdale",
    #"Rockaway Park", "Rosedale", "Roxbury",
    #"South Corona", "Somerville", "South Jamaica", 
    #"South Ozone Park", "Springfield Gardens", "St. Albans",
    "Steinway", "Sunnyside", "Sunnyside Gardens", 
    "Woodhaven", "Woodside"
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

# Create table for New York weather data
sql = """
CREATE TABLE IF NOT EXISTS events_fs_dates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    created_at TIMESTAMP,
    latitude FLOAT,
    longitude FLOAT
);
"""


try:
    #Drop table if table Comments already exists
    #cursor.execute("DROP TABLE IF EXISTS events_fs")
    #Create new table - with above commented out, new table only created if doesn't exist
    cursor.execute(sql)
    #Save the changes made to schema
    connection.commit()
except Exception as e:
    #print out error message
    print(e)
    
# start: function to commit values to Comments table previously created
def events_to_db(name, address, created_at, latitude, longitude):
    # Convert created_at to useable datetime format 
    if created_at is not None:
        created_at = datetime.datetime.strptime(created_at, '%Y-%m-%dT%H:%M:%S.%fZ')
        
    vals = (name, address, created_at, latitude, longitude)
    # Insert into table - list name, address etc. again to specify the column heading of table to insert vals into
    cursor.execute("INSERT INTO events_fs_dates (name, address, created_at, latitude, longitude) VALUES (%s, %s, %s, %s, %s)", vals)
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
                responsebr = requests.get(url, headers=headers)
                data3 = responsebr.json()
                responses.append(data3)
                print("Please wait... retrieving data for Staten Island neighborhoods")
                #time.sleep(delay)
    
    elif borough == "brooklyn":
        for b in brooklyn:
            for category in categories:
                url = f"https://api.foursquare.com/v3/places/search?categories={category}&fields=name%2Ctips%2Clocation&near={b}%2CNY&limit=50"
                responsebr = requests.get(url, headers=headers)
                data4 = responsebr.json()
                responses.append(data4)
                print("Please wait... retrieving data for Brooklyn neighborhoods")
                #time.sleep(delay)
    
    elif borough == "queens":
        for q in queens:
            for category in categories:
                url = f"https://api.foursquare.com/v3/places/search?categories={category}&fields=name%2Ctips%2Clocation&near={q}%2CNY&limit=50"
                responsebr = requests.get(url, headers=headers)
                data5 = responsebr.json()
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
                        # Call comments_to_db function to insert data into table
                        events_to_db(name, address, created_at, latitude, longitude)
                else:
                    events_to_db(name, address, None, latitude, longitude)


# Can close the cursor and connection with below commands
cursor.close()
connection.close()
