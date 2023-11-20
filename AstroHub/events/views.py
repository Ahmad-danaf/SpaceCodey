from django.shortcuts import render,get_object_or_404
from .models import NASAEvent
import requests


# Create your views here.

def event_list(request):
    #fetch_new_events()
    events = NASAEvent.objects.all()
    return render(request, 'events/event_list.html', {'events': events})

def event_detail(request, event_id):
    event = get_object_or_404(NASAEvent, pk=event_id)
    sources = event.sources.split(', ') if event.sources else []
    return render(request, 'events/event_detail.html', {'event': event, 'sources': sources})


#  Changed from a time-consuming function-based view to a management commandfor scheduled updates of-
#   the NASAEvent model.

# def fetch_new_events():
#     NASAEvent.objects.all().delete()
#     api_url = 'https://eonet.gsfc.nasa.gov/api/v2.1/events'
#     params = {
#             'limit': 10,  # Fetching 10 events
#             'days': 30,   # from the last 30 days
#         }

#     response = requests.get(api_url, params=params)

#     if response.status_code == 200:
#         data = response.json().get('events', [])
#         for event in data:
#             nasa_event = NASAEvent(
#                 event_id=event.get('id'),
#                 title=event.get('title'),
#                 description=event.get('description', ''),
#                 link=event.get('link'),
#                 categories=', '.join([category.get('title') for category in event.get('categories', [])]),
#                 sources=', '.join([source.get('url') for source in event.get('sources', [])]),
#                 )
#             nasa_event.save()
#         else:
#             # remmeber to change to log
#             print('Failed to fetch NASA events:', response.status_code)
