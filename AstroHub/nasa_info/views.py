from django.shortcuts import render
from django.conf import settings
import requests


# def nasa_apod(request):
#     return render(request, 'nasa_info/nasa_apod.html')


def nasa_apod(request):
    api_key = settings.NASA_API_KEY
    apod_url = f'https://api.nasa.gov/planetary/apod?api_key={api_key}'
    response_apod = requests.get(apod_url)

    # Check if the request was successful
    if response_apod.status_code == 200:
        data_apod = response_apod.json() 

       
        context = {
            'img_url': data_apod['url'],
            'title': data_apod['title'],
            'explanation': data_apod['explanation'],
            'copyright': data_apod['copyright'],
        }

        return render(request, 'nasa_info/nasa_apod.html', context)
    else:
        error_message = f"Error loading NASA data. Status code: {response_apod.status_code}"
        return render(request, 'error_template.html', {'error_message': error_message})
