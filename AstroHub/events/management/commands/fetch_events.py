import requests
from django.core.management.base import BaseCommand
from events.models import Event  # Replace 'app_name' with your app name

class Command(BaseCommand):
    help = 'Fetch and store events from the API'

    def handle(self, *args, **kwargs):
        api_url = "https://ll.thespacedevs.com/2.2.0/event/"

        response = requests.get(api_url)

        if response.status_code == 200:
            event_data = response.json()

            for event in event_data.get('results', []):
                Event.objects.create(
                    name=event['name'],
                    description=event['description'],
                    date=event['date'],
                    location=event['location']
                )

            self.stdout.write(self.style.SUCCESS('Events fetched and stored successfully.'))
        else:
            self.stderr.write(self.style.ERROR('Failed to fetch events from the API.'))
