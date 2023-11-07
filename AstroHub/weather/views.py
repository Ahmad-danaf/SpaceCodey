from django.shortcuts import render
import requests
import datetime
import json

def weather_index(request):
    api_key = 'da44708f0cfa3a132b3ad92588737fa7'
    current_weather_url = 'https://api.openweathermap.org/data/2.5/weather?q={}&appid={}'
    forecast_url = 'https://api.openweathermap.org/data/2.5/forecast?lat={}&lon={}&appid={}'

    if request.method == 'POST':
        city1 = request.POST['city1']
        city2 = request.POST.get('city2', None)

        weather_data1, daily_forecasts1 = fetch_weather_and_forecast(city1, api_key, current_weather_url, forecast_url)

        if city2:
            weather_data2, daily_forecasts2 = fetch_weather_and_forecast(city2, api_key, current_weather_url,
                                                                         forecast_url)
        else:
            weather_data2, daily_forecasts2 = None, None

        context = {
            'weather_data1': weather_data1,
            'daily_forecasts1': daily_forecasts1,
            'weather_data2': weather_data2,
            'daily_forecasts2': daily_forecasts2,
        }

        return render(request, 'weather/weather_index.html', context)
    else:
        return render(request, 'weather/weather_index.html')


# def fetch_weather_and_forecast(city, api_key, current_weather_url, forecast_url):
#     response = requests.get(current_weather_url.format(city, api_key)).json()
#     # Print the response to a text file
#     with open('api_response.txt', 'w') as f:
#         json.dump(response, f)
#     lat, lon = response['coord']['lat'], response['coord']['lon']
#     forecast_response = requests.get(forecast_url.format(lat, lon, api_key)).json()
#     with open('forcast_api_response.txt', 'w') as f:
#         json.dump(forecast_response, f)
#     forecast_list = forecast_response.get('list', [])
#     weather_data = {
#         'city': city,
#         'temperature': round(response['main']['temp'] - 273.15, 2),
#         'description': response['weather'][0]['description'],
#         'icon': response['weather'][0]['icon'],
#     }

#     daily_forecasts = []
#     # Iterate for 5 days
#     for i in range(5):
#         # Get the forecast data for the current day
#         forecast_data = forecast_list[i]
        
#         # Extract relevant forecast data for the day
#         day = datetime.datetime.fromtimestamp(forecast_data['dt']).strftime('%A')
#         min_temp = round(forecast_data['main']['temp_min'] - 273.15, 2)
#         max_temp = round(forecast_data['main']['temp_max'] - 273.15, 2)
#         description = forecast_data['weather'][0]['description']
#         icon = forecast_data['weather'][0]['icon']
        
#         # Append the daily forecast to the list
#         daily_forecasts.append({
#             'day': day,
#             'min_temp': min_temp,
#             'max_temp': max_temp,
#             'description': description,
#             'icon': icon,
#         })

#     return weather_data, daily_forecasts

def fetch_weather_and_forecast(city, api_key, current_weather_url, forecast_url):
    response = requests.get(current_weather_url.format(city, api_key)).json()
    # Print the response to a text file
    # with open('api_response.txt', 'w') as f:
    #     json.dump(response, f)
    lat, lon = response['coord']['lat'], response['coord']['lon']
    forecast_response = requests.get(forecast_url.format(lat, lon, api_key)).json()
    # with open('forcast_api_response.txt', 'w') as f:
    #     json.dump(forecast_response, f)
    forecast_list = forecast_response.get('list', [])
    weather_data = {
        'city': city,
        'temperature': round(response['main']['temp'] - 273.15, 2),
        'description': response['weather'][0]['description'],
        'icon': response['weather'][0]['icon'],
        'cloudiness':response['clouds']['all']
        
    }

    daily_forecasts = []
    # Iterate for 5 days
    # Extract the list of forecasts from the API response
    forecast_list = forecast_response.get('list', [])

    # Iterate for 5 days
    for i in range(5):
        # Get the forecast data for the current day
        forecast_data = forecast_list[i]
        
        # Extract relevant forecast data for the day
        day = datetime.datetime.fromtimestamp(forecast_data['dt']).strftime('%A')
        min_temp = round(forecast_data['main']['temp_min'] - 273.15, 2)
        max_temp = round(forecast_data['main']['temp_max'] - 273.15, 2)
        description = forecast_data['weather'][0]['description']
        icon = forecast_data['weather'][0]['icon']
        cloudiness = forecast_data['clouds']['all']  # Extract cloudiness percentage
        
        # Append the daily forecast to the list
        daily_forecasts.append({
            'day': day,
            'min_temp': min_temp,
            'max_temp': max_temp,
            'description': description,
            'icon': icon,
            'cloudiness': cloudiness,  # Include cloudiness data
        })

    return weather_data, daily_forecasts