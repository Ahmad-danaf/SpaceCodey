import os
import requests

SESSIONHUB_BASE_URL = os.getenv('SESSIONHUB_BASE_URL', 'http://localhost:5000/api/sessions')
SESSIONHUB_API_KEY = os.getenv('SESSIONHUB_API_KEY')

def sessionhub_request(method, endpoint='', data=None):
    headers = {
        'Authorization': f'Bearer {SESSIONHUB_API_KEY}',
    }
    url = f"{SESSIONHUB_BASE_URL}/{endpoint}"
    try:
        response = requests.request(method, url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error communicating with SessionHub: {e}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None
