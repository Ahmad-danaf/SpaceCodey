from django.views.generic import TemplateView
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

class HomePage(TemplateView):
    template_name = "index.html"
    
class LandingPage(TemplateView):
    template_name = "landing_page.html"

@login_required
def check_auth(request):
    return JsonResponse({
        "authenticated": True,
        "user_id": request.user.id,
        "username": request.user.username
    })
