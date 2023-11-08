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



# def fetch_weather_and_forecast(city, api_key, current_weather_url, forecast_url):
#     response = requests.get(current_weather_url.format(city, api_key)).json()
#     # Print the response to a text file
#     # with open('api_response.txt', 'w') as f:
#     #     json.dump(response, f)
#     lat, lon = response['coord']['lat'], response['coord']['lon']
#     forecast_response = requests.get(forecast_url.format(lat, lon, api_key)).json()
#     # with open('forcast_api_response.txt', 'w') as f:
#     #     json.dump(forecast_response, f)
#     forecast_list = forecast_response.get('list', [])
#     weather_data = {
#         'city': city,
#         'temperature': round(response['main']['temp'] - 273.15, 2),
#         'description': response['weather'][0]['description'],
#         'icon': response['weather'][0]['icon'],
#         'cloudiness':response['clouds']['all']
        
#     }

#     daily_forecasts = []
#     # Iterate for 5 days
#     # Extract the list of forecasts from the API response
#     forecast_list = forecast_response.get('list', [])

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
#         cloudiness = forecast_data['clouds']['all']  # Extract cloudiness percentage
        
#         # Append the daily forecast to the list
#         daily_forecasts.append({
#             'day': day,
#             'min_temp': min_temp,
#             'max_temp': max_temp,
#             'description': description,
#             'icon': icon,
#             'cloudiness': cloudiness,  # Include cloudiness data
#         })

#     return weather_data, daily_forecasts

def fetch_weather_and_forecast(city, api_key, current_weather_url, forecast_url):
    # Initialize the status and error_message variables
    status = 'success'
    error_message = None

    # Initialize weather_data and daily_forecasts as None
    weather_data = None
    daily_forecasts = None
    
    # Send a request to get current weather data
    current_response = requests.get(current_weather_url.format(city, api_key))
    
    # Check if the response status code indicates success (200)
    if current_response.status_code == 200:
        current_data = current_response.json()
        lat, lon = current_data['coord']['lat'], current_data['coord']['lon']
        
        # Send a request to get the forecast data
        forecast_response = requests.get(forecast_url.format(lat, lon, api_key))
        
        # Check if the forecast response is successful
        if forecast_response.status_code == 200:
            forecast_data = forecast_response.json()
            
            # Extract the list of forecasts
            forecast_list = forecast_data.get('list', [])
            
            # Initialize weather_data and daily_forecasts
            weather_data = {
                'city': city,
                'temperature': round(current_data['main']['temp'] - 273.15, 2),
                'description': current_data['weather'][0]['description'],
                'icon': current_data['weather'][0]['icon'],
                'cloudiness': current_data['clouds']['all']
            }
            
            daily_forecasts = []
            
            # Iterate for 5 days
            for i in range(5):
                if i < len(forecast_list):
                    forecast_data = forecast_list[i]
                    day = datetime.datetime.fromtimestamp(forecast_data['dt']).strftime('%A')
                    min_temp = round(forecast_data['main']['temp_min'] - 273.15, 2)
                    max_temp = round(forecast_data['main']['temp_max'] - 273.15, 2)
                    description = forecast_data['weather'][0]['description']
                    icon = forecast_data['weather'][0]['icon']
                    cloudiness = forecast_data['clouds']['all']
                    
                    daily_forecasts.append({
                        'day': day,
                        'min_temp': min_temp,
                        'max_temp': max_temp,
                        'description': description,
                        'icon': icon,
                        'cloudiness': cloudiness
                    })
        else:
            # Handle the case where the forecast request fails
            status = 'error'
            error_message = "Failed to fetch forecast data. Please try again later."
            # You can also log the error for debugging
            print("Failed to fetch forecast data:", forecast_response.status_code)
    else:
        # Handle the case where the current weather request fails
        status = 'error'
        error_message = "City not found. Please enter a valid city name."
        # You can also log the error for debugging
        print("City not found:", current_response.status_code)
    
    return weather_data, daily_forecasts, error_message
