import ephem
from datetime import datetime, timedelta, timezone
import requests
import base64
import os
import pytz
from timezonefinder import TimezoneFinder


def best_astrophotography_times(lat, lon, date_str, duration_hours):
    # Find the local time zone based on latitude and longitude
    tf = TimezoneFinder()
    local_time_zone = tf.timezone_at(lng=lon, lat=lat)
    if local_time_zone is None:
        raise ValueError("Could not determine the time zone for the provided coordinates.")
    
    local = pytz.timezone(local_time_zone)
    
    # Convert input date string to a datetime object
    date = datetime.strptime(date_str, "%Y:%m:%d %H:%M:00")
    
    # Localize the datetime object to the local time zone
    local_date = local.localize(date)
    
    # Convert to UTC for ephem calculations
    utc_date = local_date.astimezone(pytz.utc)
    
    # Initialize observer location
    observer = ephem.Observer()
    observer.lat = str(lat)
    observer.lon = str(lon)
    observer.date = utc_date
    
    # Calculate sunset and sunrise times in UTC
    observer.horizon = '-6'  # Twilight horizon
    sunset_utc = observer.next_setting(ephem.Sun()).datetime().replace(tzinfo=pytz.utc)
    sunrise_utc = observer.next_rising(ephem.Sun(), start=sunset_utc).datetime().replace(tzinfo=pytz.utc)
    
    # Convert sunset and sunrise times back to local time
    sunset = sunset_utc.astimezone(local)
    sunrise = sunrise_utc.astimezone(local)
    
    
    # print(f"Sunset (local): {sunset}, Sunrise (local): {sunrise}") # debug info for sunset and sunrise
    
    # Initialize variables
    end_time = local_date + timedelta(hours=duration_hours)
    times = []
    sun = ephem.Sun()
    moon = ephem.Moon()
    
    # Calculate best times for astrophotography in 30-minute intervals in local time
    current_time = local_date
    while current_time < end_time:
        utc_current_time = current_time.astimezone(pytz.utc)
        observer.date = utc_current_time
        sun.compute(observer)
        moon.compute(observer)
        
        sun_altitude = sun.alt
        moon_altitude = moon.alt
        moon_phase = moon.phase
        
        # Check if the Sun is below the horizon and the Moon is not too bright
        # Allowing some flexibility for the moon's altitude, e.g., moon_altitude < 10 degrees and moon_phase < 50%
        if sun_altitude < -6 * ephem.degree and (moon_altitude < 10 * ephem.degree or moon_phase < 50):  
            times.append(current_time.strftime("%Y-%m-%d %H:%M:%S"))
        
        if current_time >= sunrise:  # Break the loop if current time is past sunrise
            break
        current_time += timedelta(minutes=30)
    
    return times

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