from django.shortcuts import render,get_object_or_404,redirect
from .utils import calculate_optimal_shooting_times
from django.http import JsonResponse
from .forms import OptimalTimesForm
from django.shortcuts import render
from .models import NASAEvent
# from datetime import datetime
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

def calculate_optimal_times(request):
    
    if request.method == 'POST':
        form = OptimalTimesForm(request.POST)
        if form.is_valid():
            latitude = form.cleaned_data['latitude']
            longitude = form.cleaned_data['longitude']
            date = form.cleaned_data['date']
            start_time = form.cleaned_data['start_time']
            duration_hours = form.cleaned_data['duration']
            
            combined_datetime = f"{date} {start_time}"
            optimal_times = calculate_optimal_shooting_times(latitude, longitude, combined_datetime, duration_hours)

            return render(request, 'events/optimal_times_detail.html', context={'optimal_times': optimal_times})
    else:
        form = OptimalTimesForm()

    return render(request, 'events/optimal_times_form.html', {'form': form})