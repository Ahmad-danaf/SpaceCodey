from django.views.generic import TemplateView
from django.shortcuts import render
from dotenv import load_dotenv
import requests
import os

# Load environment variables from .env
load_dotenv()
# Use the API key
NASA_API_KEY = os.getenv('NASA_API_KEY')

# def nasa_apod(request):
#     return render(request, 'nasa_info/nasa_apod.html')


def nasa_apod(request):
    api_key = NASA_API_KEY
    apod_url = f'https://api.nasa.gov/planetary/apod?api_key={api_key}'
    response_apod = requests.get(apod_url)

    # Check if the request was successful
    if response_apod.status_code == 200:
        data_apod = response_apod.json() 

       
        default_img_url = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.m.wikipedia.org%2Fwiki%2FFile%3ANASA_logo.svg&psig=AOvVaw21ZSnQJlUh3UKr6PieQQXA&ust=1703014619769000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNio5f7dmYMDFQAAAAAdAAAAABAD'
        default_title = 'Astronomy Picture of the Day'
        default_explanation = 'Check out the stunning Astronomy Picture of the Day!'
        default_copyright = 'NASA'


        img_url = data_apod.get('url', default_img_url)
        title = data_apod.get('title', default_title)
        explanation = data_apod.get('explanation', default_explanation)
        copyright = data_apod.get('copyright', default_copyright)

        context = {
                'img_url': img_url,
                'title': title,
                'explanation': explanation,
                'copyright': copyright,
            }
        return render(request, 'nasa_info/nasa_apod.html', context)
    else:
        error_message = f"Error loading NASA data. Status code: {response_apod.status_code}"
        return render(request, 'error_template.html', {'error_message': error_message})


class ISS_tracker(TemplateView):
    template_name = "ISS_tracker.html"
    