from django.urls import path
# from . import views
from .api import NasaApodAPIView, ISSLocationAPIView, ISSTrackerView

app_name='nasa'

urlpatterns = [
    path('apod/', NasaApodAPIView.as_view(), name='nasa_apod'),  # API for NASA APOD
    path('iss-location/', ISSLocationAPIView.as_view(), name='iss_location'),  # API for ISS location
    path('iss-tracker/', ISSTrackerView.as_view(), name='ISS-tracker'),  # Template-based ISS tracker (optional)
]
