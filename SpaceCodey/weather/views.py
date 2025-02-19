from django.shortcuts import render
import requests
import datetime
import os

# Use the API key
APIKEY = os.getenv('APIKEY')

def weather_index(request):
    api_key = APIKEY
    current_weather_url = 'https://api.openweathermap.org/data/2.5/weather?q={}&appid={}'
    forecast_url = 'https://api.openweathermap.org/data/2.5/forecast?lat={}&lon={}&appid={}'

    if request.method == 'POST':
        city1 = request.POST['city1']
        city2 = request.POST.get('city2', None)

        weather_data1, daily_forecasts1, error_message1 = fetch_weather_and_forecast(city1, api_key, current_weather_url, forecast_url)

        if city2:
            weather_data2, daily_forecasts2, error_message2 = fetch_weather_and_forecast(city2, api_key, current_weather_url,
                                                                         forecast_url)
        else:
            weather_data2, daily_forecasts2, error_message2 = None, None, None

        context = {
            'weather_data1': weather_data1,
            'daily_forecasts1': daily_forecasts1,
            'error_message1': error_message1,
            'weather_data2': weather_data2,
            'daily_forecasts2': daily_forecasts2,
            'error_message2': error_message2,
        }

        return render(request, 'weather/weather_index.html', context)
    else:
        return render(request, 'weather/weather_index.html')




def fetch_weather_and_forecast(city, api_key, current_weather_url, forecast_url):
    error_message = None
    weather_data = None
    daily_forecasts = None
    
    current_response = requests.get(current_weather_url.format(city, api_key))
    
    if current_response.status_code == 200:
        current_data = current_response.json()
        lat, lon = current_data['coord']['lat'], current_data['coord']['lon']
        
        forecast_response = requests.get(forecast_url.format(lat, lon, api_key))
        
        if forecast_response.status_code == 200:
            forecast_data = forecast_response.json()
            forecast_list = forecast_data.get('list', [])
            
            weather_data = {
                'city': city,
                'temperature': round(current_data['main']['temp'] - 273.15, 2),
                'description': current_data['weather'][0]['description'],
                'icon': current_data['weather'][0]['icon'],
                'cloudiness': current_data['clouds']['all']
            }
            
            daily_forecasts = aggregate_daily_forecasts(forecast_list)
        else:
            error_message = "Failed to fetch forecast data. Please try again later."
    else:
        error_message = "City not found. Please enter a valid city name."
    
    return weather_data, daily_forecasts, error_message


def aggregate_daily_forecasts(forecast_list):
    daily_forecasts = {}
    
    for forecast_data in forecast_list:
        date = datetime.datetime.fromtimestamp(forecast_data['dt']).strftime('%Y-%m-%d')
        if date not in daily_forecasts:
            daily_forecasts[date] = {
                'day': datetime.datetime.fromtimestamp(forecast_data['dt']).strftime('%A'),
                'min_temp': float('inf'),
                'max_temp': float('-inf'),
                'description': forecast_data['weather'][0]['description'],
                'icon': forecast_data['weather'][0]['icon'],
                'cloudiness': forecast_data['clouds']['all']
            }
        
        daily_forecasts[date]['min_temp'] = min(daily_forecasts[date]['min_temp'], round(forecast_data['main']['temp_min'] - 273.15, 2))
        daily_forecasts[date]['max_temp'] = max(daily_forecasts[date]['max_temp'], round(forecast_data['main']['temp_max'] - 273.15, 2))
    
    return list(daily_forecasts.values())[:5]