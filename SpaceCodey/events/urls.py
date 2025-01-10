from django.urls import path
from . import views
from .api import event_list, event_detail, DisplayOptimalTimesAPIView, BodyInfoAPIView

app_name='events'

urlpatterns = [
    # API endpoints
    path('', event_list, name='event_list'),  # List all events
    path('<int:event_id>/', event_detail, name='event_detail'),  # Event detail
    path('optimal-times/', DisplayOptimalTimesAPIView.as_view(), name='display_optimal_times'),  # Optimal times API
    path('body-info/', BodyInfoAPIView.as_view(), name='body_info'),  # Body info API
]
