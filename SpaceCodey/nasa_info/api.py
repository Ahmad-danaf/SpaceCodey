from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.generic import TemplateView
from django.core.cache import cache
import aiohttp
import asyncio
import os

# Use the API key
NASA_API_KEY = os.getenv('NASA_API_KEY')


class NasaApodAPIView(APIView):
    """
    API endpoint to fetch the NASA Astronomy Picture of the Day (APOD).
    """

    async def fetch_apod(self, api_url):
        async with aiohttp.ClientSession() as session:
            async with session.get(api_url) as response:
                if response.status == 200:
                    return await response.json()
                return None

    def get(self, request):
        """
        Handle GET requests synchronously, wrapping async calls.
        """
        apod_url = f'https://api.nasa.gov/planetary/apod?api_key={NASA_API_KEY}'

        # Check cache for existing data
        data_apod = cache.get('nasa_apod')

        if not data_apod:
            # Use asyncio.run to fetch the APOD data asynchronously
            data_apod = asyncio.run(self.fetch_apod(apod_url))
            if data_apod:
                cache.set('nasa_apod', data_apod, timeout=60 * 60)

        if data_apod:
            return Response(data_apod)
        else:
            return Response({"error": "Error loading NASA APOD data"}, status=500)


class ISSLocationAPIView(APIView):
    """
    API endpoint to fetch the real-time location of the ISS.
    """

    async def fetch_iss_location(self):
        iss_url = "http://api.open-notify.org/iss-now.json"
        async with aiohttp.ClientSession() as session:
            async with session.get(iss_url) as response:
                if response.status == 200:
                    return await response.json()
                return None

    def get(self, request):
        """
        Handle GET requests synchronously, wrapping async calls.
        """
        # Use asyncio.run to fetch ISS location asynchronously
        iss_data = asyncio.run(self.fetch_iss_location())

        if iss_data:
            return Response(iss_data)
        else:
            return Response({"error": "Error fetching ISS location data"}, status=500)


class ISSTrackerView(TemplateView):
    template_name = "nasa_info/ISS_tracker.html"
