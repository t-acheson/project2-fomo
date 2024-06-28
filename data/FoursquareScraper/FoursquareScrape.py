# FOURSQUARE SCRAPER

#* If I could make 50 calls per category per neighbourhood in NY
#* Calculated 90 neighbourhoods X 6 categoriess in each neighbourhood X 50 responses per category
#? 100 neighbourhoods gives exactly 30,000 responses - confident that would stay in limit
#* ~27,000 returned, API allows 30,000 within limit

# 329 neighbourhoods in new york as per this list: https://www.baruch.cuny.edu/nycdata/population-geography/neighborhoods.htm
# Manhattan = 45 = 14% of total = 13 of 90
# Bronx = 56 = 17% = 15 
# Staten Island = 66 = 20% = 18
# Brooklyn = 77 = 23% = 21
# Queens = 85 = 26% = 23

# 90 neighbourhoods subsampled for out purposes
#TODO run initially by incrementing the neighbourhoods - run 5 or 10 times changing the neighbourhoods each time

# New York Boroughs
boroughs = [
    "manhattan", "bronx", "statenIsland", "brooklyn", "queens"
]

#! Uncomment different neighbourhoods for each new API call to ensure we're getting different and varied results
# Manhattan neighborhoods
manhattan = [
    "Battery Park City", "Carnegie Hill", "East Harlem", #"Financial District", "Gramercy", "Hamilton Heights",
    #"Inwood", "Lenox Hill", "Manhattan Valley", "NoHo", "Roosevelt Island", "SoHo",
    #"Times Square", "Union Square", "Wall Street", "Yorkville", "Beekman Place",
    #"Chelsea", "East Village", "Flatiron", "Greenwich Village"
]

# Bronx neighborhoods
bronx = [
    "Allerton", "Bathgate", "Castle Hill", "East Tremont", "Fieldston", #"High Bridge",
    #"Kingsbridge", "Longwood", "Marble Hill", "North Riverdale", "Olinville", "Parkchester",
    #"Riverdale", "Schuylerville", "Throgs Neck", "Unionport", "Van Nest", "Wakefield",
    #"Baychester", "City Island"
]

# Staten Island neighborhoods
statenIsland = [
    "Annadale", "Bay Terrace", "Castleton Corners", "Dongan Hills", "Egbertville", "Fox Hills", #"Graniteville",
    #"Heartland Village", "Lighthouse Hill", "Manor Heights", "New Brighton", "Oakwood", "Park Hill", "Randall Manor",
    #"Sandy Ground", "Todt Hill", "Ward Hill", "Arden Heights", "Bloomfield", "Charleston"
]

# Brooklyn neighborhoods
brooklyn = [
    "Bath Beach", "Canarsie", "Ditmas Park", "East Flatbush", "Farragut",
    "Georgetown", "Highland Park", "Kensington", "Manhattan Beach", #"Navy Yard",
    #"Ocean Hill", "Paerdegat Basin", "Red Hook", "Sea Gate", "Tompkins Park North", "Vinegar Hill",
    #"Weeksville", "Bay Ridge", "Carroll Gardens", "Downtown", "East New York", "Flatbush"
]

# Queens neighborhoods
queens = [
    "Arverne", "Bay Terrace", "Cambria Heights", "Douglaston", "East Elmhurst", "Far Rockaway",
    "Glen Oaks", "Hammels", "Jackson Heights", "Kew Gardens", "Laurelton", #"Malba", "Neponsit",
    #"Oakland Gardens", "Pomonok", "Queens Village", "Ravenswood", "Seaside", "Utopia",
    #"Whitestone", "Astoria", "Bayside", "Clearview"
]

# 6 categories to stay under 30,000
# Foursquare categories - broad
categories = [
    #"19000"	Travel and Transportation
    "18000"	#Sports and Recreation
    #17000	Retail
    "16000"	#Landmarks and Outdoors
    #15000	Health and Medicine
    "14000"	#Event
    "13065"	#Dining and Drinking > Restaurant
    "13003"	#Dining and Drinking > Bar
    #12000	Community and Government
    #11000	Business and Professional Services
    #10052	Arts and Entertainment > Strip Club
    #10043	Arts and Entertainment > Performing Arts Venue > Theater
    #10039	Arts and Entertainment > Performing Arts Venue > Music Venue
    #10035	Arts and Entertainment > Performing Arts Venue
    #10051	Arts and Entertainment > Stadium
    "10032"	#Arts and Entertainment > Night Club
    #10013	Arts and Entertainment > Dance Hall
    #10010	Arts and Entertainment > Comedy Club
    #10007	Arts and Entertainment > Carnival
    #10006	Arts and Entertainment > Bowling Alley
    #10003	Arts and Entertainment > Arcade
    #10001	Arts and Entertainment > Amusement Park
    #10000	Arts and Entertainment
]

import json
import mysql.connector
import requests
import time
import traceback
import datetime
import pytz 
import configdb
import configkey

# Connect to the database server again
# Now specifying "summer" schema
# mysql.connector
#TODO need to adjust to correctly read from config file and need to update to work for Postgres
connection = configdb.MySQL_CONFIG.connect(
    host="host",
    user="user",
    password="password",
    database="summer"
)

#create cursor object - with above database connection
cursor = connection.cursor()

# Can close the cursor and connection with below commands
# cursor.close()
# connection.close()

# Create table for New York weather data
sql = """
CREATE TABLE IF NOT EXISTS Comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    comment TEXT,
    created_at DATETIME,
    latitude FLOAT,
    longitude FLOAT
);
"""


try:
    #Drop table if table Comments already exists
    #cursor.execute("DROP TABLE IF EXISTS Comments")
    #Create new table - with above commented out, new table only created if doesn't exist
    cursor.execute(sql)
    #Save the changes made to schema
    connection.commit()
except Exception as e:
    #print out error message
    print(e)
    
# start: function to commit values to Comments table previously created
def comments_to_db(name, address, comment, created_at, latitude, longitude):
    # Convert created_at to useable datetime format 
    if created_at is not None:
        created_at = datetime.datetime.strptime(created_at, '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%Y-%m-%d %H:%M:%S')
        
    vals = (name, address, comment, created_at, latitude, longitude)
    # Insert into table - list name, address etc. again to specify the column heading of table to insert vals into
    cursor.execute("INSERT INTO Comments (name, address, comment, created_at, latitude, longitude) VALUES (%s, %s, %s, %s, %s, %s)", vals)
    connection.commit()
# end : function to commit Comments to database
                        
# Define parameters for API i.e. API key
headers = {
    "accept": "application/json",
    "Authorization": configkey.FoursquareAPIKey
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
                url = f"https://api.foursquare.com/v3/places/search?categories={category}&fields=name%2Ctips%2Clocation%2Cpopularity&near={m}%2CNY&limit=1"
                responsem = requests.get(url, headers=headers)
                data1 = responsem.json()
                # Add API response data (stored in variable data1) to responses list
                responses.append(data1)
                print("Please wait... retrieving data for Manhattan neighborhoods")
                time.sleep(delay)  # Wait before the next API call
                
    # what follows is the same as above for each of the remaining boroughs and their associated neighbourhoods            
    elif borough == "bronx":
        for br in bronx:
            for category in categories:
                url = f"https://api.foursquare.com/v3/places/search?categories={category}&fields=name%2Ctips%2Clocation%2Cpopularity&near={br}%2CNY&limit=1"
                responsebr = requests.get(url, headers=headers)
                data2 = responsebr.json()
                responses.append(data2)
                print("Please wait... retrieving data for Bronx neighborhoods")
                time.sleep(delay)
    
    elif borough == "statenIsland":
        for s in statenIsland:
            for category in categories:
                url = f"https://api.foursquare.com/v3/places/search?categories={category}&fields=name%2Ctips%2Clocation%2Cpopularity&near={s}%2CNY&limit=1"
                responsebr = requests.get(url, headers=headers)
                data3 = responsebr.json()
                responses.append(data3)
                print("Please wait... retrieving data for Staten Island neighborhoods")
                time.sleep(delay)
    
    elif borough == "brooklyn":
        for b in brooklyn:
            for category in categories:
                url = f"https://api.foursquare.com/v3/places/search?categories={category}&fields=name%2Ctips%2Clocation%2Cpopularity&near={b}%2CNY&limit=1"
                responsebr = requests.get(url, headers=headers)
                data4 = responsebr.json()
                responses.append(data4)
                print("Please wait... retrieving data for Brooklyn neighborhoods")
                time.sleep(delay)
    
    elif borough == "queens":
        for q in queens:
            for category in categories:
                url = f"https://api.foursquare.com/v3/places/search?categories={category}&fields=name%2Ctips%2Clocation%2Cpopularity&near={q}%2CNY&limit=1"
                responsebr = requests.get(url, headers=headers)
                data5 = responsebr.json()
                responses.append(data5)
                print("Please wait... retrieving data for Queens neighborhoods")
                time.sleep(delay)

# uncomment below to visualise code response
print(responsem.text, responsebr.text)

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
                        comment = tip.get('text')
                        created_at = tip.get('created_at')
                        # Call comments_to_db function to insert data into table
                        comments_to_db(name, address, comment, created_at, latitude, longitude)
                else:
                    comments_to_db(name, address, None, None, latitude, longitude)


# Can close the cursor and connection with below commands
cursor.close()
connection.close()