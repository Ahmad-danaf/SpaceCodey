from django.views.generic import TemplateView
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

class HomePage(TemplateView):
    template_name = "index.html"
    
class LandingPage(TemplateView):
    template_name = "landing_page.html"

@method_decorator(login_required, name='dispatch')
def check_auth(request):
    if not request.user.is_authenticated:
        return JsonResponse({'authenticated': False, 'message': 'Unauthorized'}, status=401)
    return JsonResponse({'authenticated': True, 'userId': request.user.id,"username":request.user.username})