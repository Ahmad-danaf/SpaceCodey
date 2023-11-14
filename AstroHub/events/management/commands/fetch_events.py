import requests
from django.core.management.base import BaseCommand
from events.models import NASAEvent  

class Command(BaseCommand):
    help = 'Fetch and store events from the API'

    def handle(self, *args, **kwargs):
        NASAEvent.objects.all().delete()
        api_url = 'https://eonet.gsfc.nasa.gov/api/v2.1/events'
        params = {
            'limit': 10,  # Fetching 10 events
            'days': 30,   # from the last 30 days
        }

        response = requests.get(api_url, params=params)

        if response.status_code == 200:
            data = response.json().get('events', [])
            for event in data:
                nasa_event = NASAEvent(
                    event_id=event.get('id'),
                    title=event.get('title'),
                    description=event.get('description', ''),
                    link=event.get('link'),
                    categories=', '.join([category.get('title') for category in event.get('categories', [])]),
                    sources=', '.join([source.get('url') for source in event.get('sources', [])]),
                )
                nasa_event.save()
        else:
            # remmeber to change to log
            print('Failed to fetch NASA events:', response.status_code)
