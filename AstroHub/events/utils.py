import ephem
from datetime import datetime, timedelta
import requests
import base64
import os
from dotenv import load_dotenv

def calculate_optimal_shooting_times(lat, lon, date, duration_hours):
    observer = ephem.Observer()
    observer.lat = str(lat)
    observer.lon = str(lon)

    optimal_times = []
    start_time = datetime.strptime(date, '%Y-%m-%d %H:%M:%S')
    end_time = start_time + timedelta(hours=duration_hours)

    while start_time < end_time:
        observer.date = start_time
        sun = ephem.Sun(observer)
        moon = ephem.Moon(observer)

        moon_phase = moon.phase / 100
        moon_altitude = float(moon.alt) * 180.0 / ephem.pi
        sunset = observer.next_setting(sun).datetime() + timedelta(minutes=30)
        sunrise = observer.next_rising(sun).datetime()

        # Adjust the sunset and sunrise to cover a 24-hour period
        previous_sunset = sunset - timedelta(hours=24)
        next_sunrise = sunrise + timedelta(hours=24)

        # Calculate astronomical twilight start and end
        observer.horizon = '-18'  # Set horizon to account for astronomical twilight
        astronomical_twilight_start = observer.previous_rising(ephem.Sun(), use_center=True).datetime()
        astronomical_twilight_end = observer.next_setting(ephem.Sun(), use_center=True).datetime()

        # Reset horizon to default (0 degrees)
        observer.horizon = '0'

        if (moon_phase < 0.5) and (moon_altitude < 20) and \
            (start_time > previous_sunset) and (start_time < next_sunrise) and \
            (astronomical_twilight_start < start_time < astronomical_twilight_end):
                optimal_times.append(start_time)

        start_time += timedelta(minutes=60)
        
        formatted_times = [time.strftime('%Y-%m-%d %H:%M') for time in optimal_times]

    return formatted_times



def get_auth_string():
    load_dotenv()
    userpass = f"{os.getenv('ASTRONOMY_API_ID')}:{os.getenv('ASTRONOMY_API_SECRET')}"
    return base64.b64encode(userpass.encode()).decode()

def fetch_body_positions(latitude, longitude, elevation, from_date, to_date, time):
    url = "https://api.astronomyapi.com/api/v2/bodies/positions"
    auth_string = get_auth_string()
    
    headers = {
        "Authorization": f"Basic {auth_string}"
    }
    
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "elevation": elevation,
        "from_date": from_date,
        "to_date": to_date,
        "time": time,
        "output": "table"
    }
    
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()

def fetch_body_events(body, latitude, longitude, elevation, from_date, to_date, time):
    supported_bodies = ['sun', 'moon']
    if body.lower() not in supported_bodies:
        return {'error': f'Events data for {body} is not supported by the API.'}
    
    url = f"https://api.astronomyapi.com/api/v2/bodies/events/{body}"
    auth_string = get_auth_string()
    
    headers = {
        "Authorization": f"Basic {auth_string}"
    }
    
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "elevation": elevation,
        "from_date": from_date,
        "to_date": to_date,
        "time": time,
        "output": "table"
    }
    
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()