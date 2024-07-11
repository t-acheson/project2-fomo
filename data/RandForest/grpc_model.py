import pickle
import pandas as pd
from datetime import datetime, timedelta
import pytz

# Load model
# with open('RF_m1.pkl', 'rb') as file:
#     model = pickle.load(file)
    
# Load the trained model
try:
    with open('RF_m1.pkl', 'rb') as file:
        model = pickle.load(file)
    print("Model loaded successfully.")
except EOFError:
    print("Error: The model file is empty or corrupted.")
except Exception as e:
    print(f"Error loading model: {e}")

# Label encoder
#with open('label_encoder.pkl', 'rb') as file:
    #le = pickle.load(file)