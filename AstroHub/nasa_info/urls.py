from django.urls import path
from . import views

app_name='nasa'

urlpatterns = [
    path('nasa-apod/', views.nasa_apod, name='nasa_apod'),
]
