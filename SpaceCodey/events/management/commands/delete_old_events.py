from django.core.management.base import BaseCommand
from events.models import NASAEvent
from datetime import datetime

class Command(BaseCommand):
    help = 'Delete old events from the database'

    def handle(self, *args, **options):
        # Define the criteria for old events
        cutoff_date = datetime.now()  # Adjust this date as needed

        # Use the filter method to get events older than the cutoff date
        old_events = NASAEvent.objects.filter(date__lt=cutoff_date)

        # Delete the old events
        deleted_count, _ = old_events.delete()

        # Print the number of deleted events
        self.stdout.write(self.style.SUCCESS(f'{deleted_count} events deleted successfully.'))
