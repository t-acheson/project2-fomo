import requests
import json

# Your Eventbrite API token
TOKEN = '62AG2UHC6RH7NLHYREDU'

# URL to search for events in NYC
BASE_URL = 'https://www.eventbriteapi.com/v3/venues/:venue_id/events/?token=62AG2UHC6RH7NLHYREDU'
#BASE_URL = 'https://www.eventbriteapi.com/v3/users/me/?token=62AG2UHC6RH7NLHYREDU'

# Parameters for the search request
PARAMS = {
    #'event_ids': 'music',
    #'venue_id': 'NY',
    #'token': TOKEN,  # Pass the token as a parameter
    'page_size': 1  # Fetch only one event for inspection
}


# Make the initial request to inspect the data structure
response = requests.get(BASE_URL, params=PARAMS)

# Check if the request was successful
if response.status_code == 200:
    print("Success")
    data = response.json()
    # Print the JSON response for inspection
    print(data)
else:
    print(f"Failed with status code: {response.status_code}")
    print(response.text)
    
    # Print the whole JSON response for inspection
    #print(json.dumps(data, indent=4))
    
    # Extract and print basic info about the first event (optional)
    #events = data.get('events', [])
    #if events:
        #first_event = events[0]
        #print(f"Name: {first_event['name']['text']}")
        #print(f"Start: {first_event['start']['local']}")
        #print(f"End: {first_event['end']['local']}")
        
        # Venue info
        #venue = first_event.get('venue')
        #if venue:
            #print(f"Venue: {venue['name']}")
            #print(f"Address: {venue['address']['localized_address_display']}")
            #print(f"City: {venue['address']['city']}")
            #print(f"Latitude: {venue['latitude']}")
            #print(f"Longitude: {venue['longitude']}")
        #else:
            #print("Venue information is not available")
    
    #print("-" * 20)
#else:
    #print(f"Failed to retrieve events: {response.status_code}")
    #print(response.text)  # Print the error message if any
