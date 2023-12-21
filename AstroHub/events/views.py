from django.shortcuts import render,get_object_or_404
from .models import NASAEvent
# import requests


# Create your views here.

def event_list(request):
    #fetch_new_events()
    events = NASAEvent.objects.all()
    return render(request, 'events/event_list.html', {'events': events})

def event_detail(request, event_id):
    event = get_object_or_404(NASAEvent, pk=event_id)
    sources = event.sources.split(', ') if event.sources else []
    return render(request, 'events/event_detail.html', {'event': event, 'sources': sources})

