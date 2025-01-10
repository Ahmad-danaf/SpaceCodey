from django.http import JsonResponse
from django.conf import settings

class APIKeyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if the path starts with 'api/' to restrict only API requests
        if request.path.startswith('/api/'):
            api_key = request.headers.get('x-api-key')  # Expected format: key x-api-key value: <API_KEY>
            if not api_key or api_key !=  settings.X_API_KEY:
                return JsonResponse({"error": "Unauthorized. Invalid or missing API key."}, status=401)
        return self.get_response(request)
