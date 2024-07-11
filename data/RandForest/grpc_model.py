import pickle
import pandas as pd
from datetime import datetime, timedelta
import pytz

# Load model
try:
    with open('RF_m1.pkl', 'rb') as file:
        model = pickle.load(file)
    #print("Model loaded successfully.")
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

def predict_busyness(locationid):
    # Current datetime - New York
    now = datetime.now(ny_tz)
    
    # Datetime for 1 hour from now
    future_time = now + timedelta(hours=1)
    
    # Extract hour, day of week, and month - values model is trained on
    hour = future_time.hour
    day = future_time.day
    month = future_time.month
    weekday = future_time.weekday()
    
    # Input features
    input_data = pd.DataFrame({
        'locationid': [locationid],
        'hour': [hour],
        'day': [day],
        'month': [month],
        'weekday': [weekday]
    })
    
    input_data['locationid'] = input_data['locationid'].astype('category')
    input_data['day'] = input_data['day'].astype('category')
    input_data['month'] = input_data['month'].astype('category')
    input_data['weekday'] = input_data['weekday'].astype('category')
    
    prediction = model.predict(input_data)
    
    # numeric prediction to its corresponding busyness label 
    predicted_label = label_mapping[prediction[0]]
    
    return predicted_label

# Test the prediction function
#locationid = 6
#predicted_busyness = predict_busyness(location_id)
#print(f"Predicted busyness at location {location_id} 1 hour from now in New York: {predicted_busyness}")

if __name__ == "__main__":
    # Input by user
    locationid = input()
    print(predict_busyness(locationid))