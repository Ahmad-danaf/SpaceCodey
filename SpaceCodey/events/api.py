from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import NASAEvent
from django.shortcuts import get_object_or_404
from .utils import best_astrophotography_times, fetch_body_positions, fetch_body_events
from geopy.geocoders import Nominatim
from datetime import datetime
from django.http import Http404

def event_list(request):
    # fetch_new_events()
    events = NASAEvent.objects.all().values()
    return JsonResponse(list(events), safe=False)

def event_detail(request, event_id):
    try:
        # Try to get the event or raise Http404 if not found
        event = get_object_or_404(NASAEvent, pk=event_id)
    except Http404:
        # Return a custom JSON error message instead of the default 404 page
        return JsonResponse({"detail": "Event not found"}, status=404)

    data = {
        'event': {
            'id': event.id,
            'name': event.name,
            'description': event.description,
            'sources': event.sources.split(', ') if event.sources else [],
        }
    }

    # Return the event data as JSON
    return JsonResponse(data)

class DisplayOptimalTimesAPIView(APIView):
    def get(self, request):
        geolocator = Nominatim(user_agent="astro_app")
        city = request.GET.get('city')
        latitude = request.GET.get('latitude')
        longitude = request.GET.get('longitude')
        start_date = request.GET.get('start_date', '2024-06-01')
        start_time = request.GET.get('start_time', '20:00')
        duration_hours = int(request.GET.get('duration', 6))

        # Default location (Example: Cincinnati, Ohio)
        default_latitude = 39.1031
        default_longitude = -84.5120
        chosen_place = {'city': '', 'lat': default_latitude, 'long': default_longitude}

        # Handle city or latitude/longitude inputs
        if city:
            location = geolocator.geocode(city)
            if location:
                chosen_place['city'] = city
                latitude = location.latitude
                longitude = location.longitude
                chosen_place['lat'] = latitude
                chosen_place['long'] = longitude
            else:
                latitude = default_latitude
                longitude = default_longitude
        elif latitude and longitude:
            latitude = float(latitude)
            longitude = float(longitude)
            chosen_place['lat'] = latitude
            chosen_place['long'] = longitude
        else:
            latitude = default_latitude
            longitude = default_longitude

        # Handle start_date
        try:
            date = datetime.strptime(start_date, "%Y-%m-%d").strftime("%Y:%m:%d")
        except ValueError:
            date = "2024:11:23"

        combined_datetime = f"{date} {start_time}:00"

        # Call the utility function to calculate optimal times
        optimal_times = best_astrophotography_times(latitude, longitude, combined_datetime, duration_hours)

        # Prepare the response data
        data = {
            'optimal_times': optimal_times,
            'city': chosen_place['city'] or 'Default City',
            'latitude': chosen_place['lat'],
            'longitude': chosen_place['long'],
        }
        return Response(data)


class BodyInfoAPIView(APIView):
    def get(self, request):
        body = request.GET.get('body', 'sun')
        latitude = request.GET.get('latitude', '38.775867')
        longitude = request.GET.get('longitude', '-84.39733')
        elevation = request.GET.get('elevation', '0')
        from_date = request.GET.get('from_date', '2024-06-05')
        to_date = request.GET.get('to_date', '2024-06-06')
        time = request.GET.get('time', '00:00:00')

        # Fetch celestial body positions
        positions = fetch_body_positions(latitude, longitude, elevation, from_date, to_date, time)

        # Fetch celestial body events
        events = fetch_body_events(body, latitude, longitude, elevation, from_date, to_date, time)

        # Filter positions data to match the requested body
        filtered_positions = {
            'data': {
                'table': {
                    'rows': [
                        row for row in positions['data']['table']['rows']
                        if row['entry']['name'].lower() == body.lower()
                    ]
                }
            }
        }

        # Prepare the response data
        response_data = {
            'positions': filtered_positions,
            'events': events,
            'body': body,
            'latitude': latitude,
            'longitude': longitude,
            'elevation': elevation,
            'from_date': from_date,
            'to_date': to_date,
            'time': time,
        }

        return Response(response_data)