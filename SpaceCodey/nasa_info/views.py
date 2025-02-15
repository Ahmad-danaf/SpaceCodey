from django.views.generic import TemplateView
from django.shortcuts import render
from django.core.cache import cache
import aiohttp
from asgiref.sync import sync_to_async
import os


# Use the API key
NASA_API_KEY = os.getenv('NASA_API_KEY')


async def fetch_apod(api_url):
    async with aiohttp.ClientSession() as session:
        async with session.get(api_url) as response:
            if response.status == 200:
                return await response.json()
            else:
                return None


async def nasa_apod(request):
    api_key = NASA_API_KEY
    apod_url = f'https://api.nasa.gov/planetary/apod?api_key={api_key}'

    # Use sync_to_async to handle the cache.get operation in an async context
    data_apod = await sync_to_async(cache.get)('nasa_apod')

    if not data_apod:
        data_apod = await fetch_apod(apod_url)
        if data_apod:
            # Use sync_to_async to handle the cache.set operation
            await sync_to_async(cache.set)('nasa_apod', data_apod, timeout=60 * 60)  # Cache for 1 hour

    if data_apod:
        default_img_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/165px-NASA_logo.svg.png'
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

        # Use sync_to_async to handle the render operation
        return await sync_to_async(render)(request, 'nasa_info/nasa_apod.html', context)
    else:
        error_message = "Error loading NASA data."
        return await sync_to_async(render)(request, 'nasa_info/error_template.html', {'error_message': error_message})

class ISS_tracker(TemplateView):
    template_name = "nasa_info/ISS_tracker.html"
    