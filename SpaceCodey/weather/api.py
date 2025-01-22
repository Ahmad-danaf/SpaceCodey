from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import datetime
import os
from rest_framework.permissions import AllowAny
from time import sleep
API_KEY = os.getenv('APIKEY')

class WeatherAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        city1 = request.query_params.get('city1')
        city2 = request.query_params.get('city2', None)

        if not city1:
            return Response({'error': 'City1 is required.'}, status=status.HTTP_400_BAD_REQUEST)

        current_weather_url = 'https://api.openweathermap.org/data/2.5/weather?q={}&appid={}'
        forecast_url = 'https://api.openweathermap.org/data/2.5/forecast?lat={}&lon={}&appid={}'

        # Fetch weather data for city1
        weather_data1, daily_forecasts1, error_message1 = self.fetch_weather_and_forecast(city1, current_weather_url, forecast_url)

        # Fetch weather data for city2 if provided
        if city2:
            weather_data2, daily_forecasts2, error_message2 = self.fetch_weather_and_forecast(city2, current_weather_url, forecast_url)
        else:
            weather_data2, daily_forecasts2, error_message2 = None, None, None

        # Prepare the response
        response_data = {
            'city1': {
                'weather': weather_data1,
                'forecasts': daily_forecasts1,
                'error': error_message1,
            },
            'city2': {
                'weather': weather_data2,
                'forecasts': daily_forecasts2,
                'error': error_message2,
            },
        }

        return Response(response_data)

    def fetch_weather_and_forecast(self, city, current_weather_url, forecast_url):
        error_message = None
        weather_data = None
        daily_forecasts = None

        # Fetch current weather data
        current_response = requests.get(current_weather_url.format(city, API_KEY))
        if current_response.status_code == 200:
            current_data = current_response.json()
            lat, lon = current_data['coord']['lat'], current_data['coord']['lon']

            # Fetch forecast data
            forecast_response = requests.get(forecast_url.format(lat, lon, API_KEY))
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

                daily_forecasts = self.aggregate_daily_forecasts(forecast_list)
            else:
                error_message = "Failed to fetch forecast data. Please try again later."
        else:
            error_message = "City not found. Please enter a valid city name."

        return weather_data, daily_forecasts, error_message

    def aggregate_daily_forecasts(self, forecast_list):
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

            daily_forecasts[date]['min_temp'] = min(
                daily_forecasts[date]['min_temp'],
                round(forecast_data['main']['temp_min'] - 273.15, 2)
            )
            daily_forecasts[date]['max_temp'] = max(
                daily_forecasts[date]['max_temp'],
                round(forecast_data['main']['temp_max'] - 273.15, 2)
            )

        return list(daily_forecasts.values())[:5]


class WeatherTestAPI(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        # sleep(5)
        return Response({
    "city1": {
        "weather": {
            "city": "ramla",
            "temperature": 18.68,
            "description": "clear sky",
            "icon": "01d",
            "cloudiness": 0
        },
        "forecasts": [
            {
                "day": "Tuesday",
                "min_temp": 13.82,
                "max_temp": 19.96,
                "description": "clear sky",
                "icon": "01d",
                "cloudiness": 0
            },
            {
                "day": "Wednesday",
                "min_temp": 12.96,
                "max_temp": 18.49,
                "description": "broken clouds",
                "icon": "04n",
                "cloudiness": 52
            },
            {
                "day": "Thursday",
                "min_temp": 12.51,
                "max_temp": 17.7,
                "description": "light rain",
                "icon": "10n",
                "cloudiness": 55
            },
            {
                "day": "Friday",
                "min_temp": 11.48,
                "max_temp": 17.56,
                "description": "scattered clouds",
                "icon": "03n",
                "cloudiness": 48
            },
            {
                "day": "Saturday",
                "min_temp": 11.5,
                "max_temp": 18.32,
                "description": "overcast clouds",
                "icon": "04n",
                "cloudiness": 100
            }
        ],
        "error": None
    },
    "city2": {
        "weather": {
            "city": "Tel-Aviv",
            "temperature": 19.14,
            "description": "clear sky",
            "icon": "01d",
            "cloudiness": 0
        },
        "forecasts": [
            {
                "day": "Tuesday",
                "min_temp": 15.89,
                "max_temp": 19.14,
                "description": "clear sky",
                "icon": "01d",
                "cloudiness": 0
            },
            {
                "day": "Wednesday",
                "min_temp": 15.1,
                "max_temp": 18.39,
                "description": "broken clouds",
                "icon": "04n",
                "cloudiness": 51
            },
            {
                "day": "Thursday",
                "min_temp": 14.04,
                "max_temp": 17.41,
                "description": "light rain",
                "icon": "10n",
                "cloudiness": 40
            },
            {
                "day": "Friday",
                "min_temp": 13.33,
                "max_temp": 17.11,
                "description": "light rain",
                "icon": "10n",
                "cloudiness": 44
            },
            {
                "day": "Saturday",
                "min_temp": 13.21,
                "max_temp": 18.09,
                "description": "overcast clouds",
                "icon": "04n",
                "cloudiness": 100
            }
        ],
        "error": None
    }
})