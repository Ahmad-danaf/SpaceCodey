from django.urls import path
from . import views

app_name='events'

urlpatterns = [
    path('events/', views.event_list, name='event_list'),
    path('event/<int:event_id>/', views.event_detail, name='event_detail'),
    path('optimal_times/', views.calculate_optimal_times, name='optimal_times'),
    path('body_info/', views.body_info, name='body_info'),
    path('input_location/', views.input_location, name='input_location'),
    path('display_optimal_times/', views.display_optimal_times, name='display_optimal_times'),
]