from django.urls import path
from . import api

app_name='weather'

urlpatterns = [
    path('', api.WeatherAPIView.as_view(), name='weather_api'),
]