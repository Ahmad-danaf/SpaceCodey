from django.urls import path
from . import views

app_name='events'

urlpatterns = [
    path('events/', views.event_list, name='event_list'),
    path('event/<int:event_id>/', views.event_detail, name='event_detail'),
    path('optimal_times/', views.calculate_optimal_times, name='optimal_times'),
]