# Foursquare Scraper initial testing and attempts

#* Commented out code bellow was initial testing of foursquare API
#import requests

#url = "https://api.foursquare.com/v3/places/match"

#params = {
  	#"name": "Foursquare",
    #"address": "50 W 23rd St",
    #"city": "New York",
    #"state": "New York",
    #"postalCode": "10010",
    #"cc": "US",
    #"ll": "43.000351,-75.499901",
#}

#headers = {
    #"Accept": "application/json",
    #"Authorization": "fsq39ABlAtI+mIE6JF0tuXHBscUcSmPl2heIDngD/xaobE4="
#}

#response = requests.request("GET", url, params=params, headers=headers)

#print(response.text)


# Get back list of places in New York
#import requests

#url = "https://api.foursquare.com/v3/places/search?near=New%20York&limit=50"

#headers = {
    #"accept": "application/json",
    #"Authorization": "fsq39ABlAtI+mIE6JF0tuXHBscUcSmPl2heIDngD/xaobE4="
    #}

#response = requests.get(url, headers=headers)

#print(response.text)

#TODO Think I need to take the list of places output here and feed it into Venues to get venue tips
#TODO researching how to do this and venue tips

#! Think Foursquare limits to 50 responses per call
#* maybe instead of looking for all of new york could get 50 results per date? per neighbourhood and per category? 
#import requests

#url = "https://api.foursquare.com/v3/places/search?fields=tips&near=New%20York&limit=50"

#headers = {
    #"accept": "application/json",
    #"Authorization": "fsq39ABlAtI+mIE6JF0tuXHBscUcSmPl2heIDngD/xaobE4="
#}

#response = requests.get(url, headers=headers)

#print(response.text)

#* If I could make 50 calls per category per neighbourhood in NY

# Manhattan = 45 = 14% = 6
# Bronx = 56 = 17% = 10
# Staten Island = 66 = 20% = 13
# Brooklyn = 77 = 23% = 18
# Queens = 85 = 26% = 22
#69 total

# New York Boroughs
boroughs = [
    "manhattan", "bronx", #"statenIsland", "brooklyn", "queens"
]


# Manhattan neighborhoods
manhattan = [
    "Battery Park City", "Carnegie Hill", #"East Harlem", "Financial District", "Gramercy", "Hamilton Heights",
    #"Inwood", "Lenox Hill", "Manhattan Valley", "NoHo", "Roosevelt Island", "SoHo",
    #"Times Square", "Union Square", "Wall Street", "Yorkville", "Beekman Place",
    #"Chelsea", "East Village", "Flatiron", "Greenwich Village"
]

# Bronx neighborhoods
bronx = [
    "Allerton", "Bathgate", #"Castle Hill", "East Tremont", "Fieldston", "High Bridge",
    #"Kingsbridge", "Longwood", "Marble Hill", "North Riverdale", "Olinville", "Parkchester",
    #"Riverdale", "Schuylerville", "Throgs Neck", "Unionport", "Van Nest", "Wakefield",
    #"Baychester", "City Island"
]

# Staten Island neighborhoods
#statenIsland = [
    #"Annadale", "Bay Terrace", "Castleton Corners", "Dongan Hills", "Egbertville", "Fox Hills", "Graniteville",
    #"Heartland Village", "Lighthouse Hill", "Manor Heights", "New Brighton", "Oakwood", "Park Hill", "Randall Manor",
    #"Sandy Ground", "Todt Hill", "Ward Hill", "Arden Heights", "Bloomfield", "Charleston"
#]

# Brooklyn neighborhoods
#brooklyn = [
    #"Bath Beach", "Canarsie", "Ditmas Park", "East Flatbush", "Farragut",
    #"Georgetown", "Highland Park", "Kensington", "Manhattan Beach", "Navy Yard",
    #"Ocean Hill", "Paerdegat Basin", "Red Hook", "Sea Gate", "Tompkins Park North", "Vinegar Hill",
    #"Weeksville", "Bay Ridge", "Carroll Gardens", "Downtown", "East New York", "Flatbush"
#]

# Queens neighborhoods
#queens = [
    #"Arverne", "Bay Terrace", "Cambria Heights", "Douglaston", "East Elmhurst", "Far Rockaway",
    #"Glen Oaks", "Hammels", "Jackson Heights", "Kew Gardens", "Laurelton", "Malba", "Neponsit",
    #"Oakland Gardens", "Pomonok", "Queens Village", "Ravenswood", "Seaside", "Utopia",
    #"Whitestone", "Astoria"
#]

# 7 categories to stay under 30,000
# Foursquare categories - broad
categories = [
    #"19000"	Travel and Transportation
    #18000	Sports and Recreation
    #17000	Retail
    #16000	Landmarks and Outdoors
    #15000	Health and Medicine
    #14000	Event
    #13065	Dining and Drinking > Restaurant
    "13003"	#Dining and Drinking > Bar
    #12000	Community and Government
    #11000	Business and Professional Services
    #10052	Arts and Entertainment > Strip Club
    #10043	Arts and Entertainment > Performing Arts Venue > Theater
    #10039	Arts and Entertainment > Performing Arts Venue > Music Venue
    #10051	Arts and Entertainment > Stadium
    #10032	Arts and Entertainment > Night Club
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
    #Drop table if table weather_NY already exists
    #cursor.execute("DROP TABLE IF EXISTS weather_NY")
    #Create new table - with above commented out, new table only created if doesn't exist
    cursor.execute(sql)
    #Save the changes made to schema
    connection.commit()
except Exception as e:
    #print out error message
    print(e)
    

def comments_to_db(name, address, comment, created_at, latitude, longitude):
    if created_at is not None:
        created_at = datetime.datetime.strptime(created_at, '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%Y-%m-%d %H:%M:%S')
        
    vals = (name, address, comment, created_at, latitude, longitude)
    cursor.execute("INSERT INTO Comments (name, address, comment, created_at, latitude, longitude) VALUES (%s, %s, %s, %s, %s, %s)", vals)
    connection.commit()
                        
    

#url = "https://api.foursquare.com/v3/places/search?categories=19000&fields=name%2Ctips%2Clocation%2Cpopularity&near=Allerton%2CNY&limit=10"

headers = {
    "accept": "application/json",
    "Authorization": configkey.FoursquareAPIKEY
}

responses = []

for borough in boroughs:
    if borough == "manhattan":
        for m in manhattan:
            for category in categories:
                url = f"https://api.foursquare.com/v3/places/search?categories={category}&fields=name%2Ctips%2Clocation%2Cpopularity&near={m}%2CNY&limit=2"
                responsem = requests.get(url, headers=headers)
                data1 = responsem.json()
                responses.append(data1)
                
    if borough == "bronx":
        for br in bronx:
            for category in categories:
                url = f"https://api.foursquare.com/v3/places/search?categories={category}&fields=name%2Ctips%2Clocation%2Cpopularity&near={br}%2CNY&limit=2"
                responsebr = requests.get(url, headers=headers)
                data2 = responsebr.json()
                responses.append(data2)

print(responsem.text, responsebr.text)

for data in responses:
    for result in data.get('results', []):
                name = result.get('name')
                address = result['location'].get('formatted_address')
                latitude = data['context']['geo_bounds']['circle']['center']['latitude']
                longitude = data['context']['geo_bounds']['circle']['center']['longitude']

                if 'tips' in result:
                    for tip in result['tips']:
                        comment = tip.get('text')
                        created_at = tip.get('created_at')
                        comments_to_db(name, address, comment, created_at, latitude, longitude)
                else:
                    comments_to_db(name, address, None, None, latitude, longitude)

