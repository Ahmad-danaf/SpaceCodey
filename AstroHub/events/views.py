from django.shortcuts import render,get_object_or_404,redirect
from .utils import calculate_optimal_shooting_times, fetch_body_events, fetch_body_positions
from django.http import JsonResponse
from .forms import OptimalTimesForm
from django.shortcuts import render
from .models import NASAEvent


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


def body_info(request):
    body = request.GET.get('body', 'sun')
    latitude = request.GET.get('latitude', '38.775867')
    longitude = request.GET.get('longitude', '-84.39733')
    elevation = request.GET.get('elevation', '0')
    from_date = request.GET.get('from_date', '2024-06-05')
    to_date = request.GET.get('to_date', '2024-06-06')
    time = request.GET.get('time', '00:00:00')

    positions = fetch_body_positions(latitude, longitude, elevation, from_date, to_date, time)
    events = fetch_body_events(body, latitude, longitude, elevation, from_date, to_date, time)
    
    # Filter positions data
    filtered_positions = {
        'data': {
            'table': {
                'rows': [row for row in positions['data']['table']['rows'] if row['entry']['name'].lower() == body.lower()]
            }
        }
    }
    
    return render(request, 'events/body_info.html', {
        'positions': filtered_positions,
        'events': events,
        'body': body,
        'latitude': latitude,
        'longitude': longitude,
        'elevation': elevation,
        'from_date': from_date,
        'to_date': to_date,
        'time': time
    })