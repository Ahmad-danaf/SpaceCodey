from datetime import datetime, timedelta
import requests
import base64
import os
from dotenv import load_dotenv

def fetch_body_events(body, latitude, longitude, elevation, from_date, to_date, time):
    load_dotenv()
    url = f"https://api.astronomyapi.com/api/v2/bodies/events/{body}"
    
    # Create the Basic Auth string
    userpass = f"{os.getenv('ASTRONOMY_API_ID')}:{os.getenv('ASTRONOMY_API_SECRET')}"
    print(f"userpass is: {userpass}")
    authString = base64.b64encode(userpass.encode()).decode()
    
    headers = {
        "Authorization": f"Basic {authString}"
    }
    
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "elevation": elevation,
        "from_date": from_date,
        "to_date": to_date,
        "time": time,
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    # Debugging statements
    print("Request URL:", response.url)
    print("Status Code:", response.status_code)
    try:
        print("Response JSON:", response.json())
    except ValueError:
        print("Response Content:", response.content)
    
    if response.status_code == 200:
        return response.json()
    else:
        return None
    
# Test parameters
body = 'moon'
latitude = '38.775867'
longitude = '-84.39733'
elevation = '5'
from_date = '2024-06-05'
to_date = '2024-12-23'
time = '00:00:00'  # Add a valid time parameter

# Fetch events
events = fetch_body_events(body, latitude, longitude, elevation, from_date, to_date, time)

# Check if events were fetched successfully
if events:
    print("Fetched Events:", events)
else:
    print("Failed to fetch events")
