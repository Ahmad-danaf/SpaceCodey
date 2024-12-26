from django.shortcuts import render, get_object_or_404
from .models import Tip, Article
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages
from django.views.generic import TemplateView
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .utils.sessionhub import sessionhub_request
import os


def tips_list(request):
    tips = Tip.objects.all().order_by('-created_at')
    return render(request, 'content/tips_list.html', {'tips': tips})


def tip_detail(request, pk):
    tip = get_object_or_404(Tip, pk=pk)
    return render(request, 'content/tip_detail.html', {'tip': tip})


def articles_list(request):
    articles = Article.objects.all().order_by('-created_at')
    return render(request, 'content/articles_list.html', {'articles': articles})


def article_detail(request, pk):
    article = get_object_or_404(Article, pk=pk)
    return render(request, 'content/article_detail.html', {'article': article})


def tips_articles(request):
    return render(request, 'content/tips_articles.html')



def contact_us(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')

        full_message = f"Message from {name} ({email}):\n\n{message}"


        send_mail(
            subject,
            full_message,
            settings.DEFAULT_FROM_EMAIL,
            [settings.CONTACT_EMAIL],
        )

        # Show success message
        messages.success(request, "Your message has been sent successfully!")
        return render(request, 'content/contact_us.html')

    return render(request, 'content/contact_us.html')

class SupportMeView(TemplateView):
    template_name = 'content/support_me.html'


# Base URL of the SessionHub API
SESSIONHUB_API_BASE_URL = os.getenv('SESSIONHUB_BASE_URL', 'http://localhost:5000/api/sessions')

@login_required
def session_list(request):
    user_id = request.user.id
    sessions = sessionhub_request('GET', data={'userId': user_id})
    
    if sessions:
        for session in sessions:
            session['id'] = session.pop('_id', None)  # Rename `_id` to `id` if it exists
    
    return render(request, 'content/session_list.html', {'sessions': sessions})


@login_required
def add_session(request):
    if request.method == 'POST':
        session_data = {
            'userId': request.user.id,
            'date': request.POST['date'],
            'location': request.POST['location'],
            'notes': request.POST['notes'],
            'sessionType': 'log',
            'status': 'upcoming',
        }
        sessionhub_request('POST', data=session_data)
        return redirect('content:session_list')
    return render(request, 'content/session_form.html')

@login_required
def delete_session(request, session_id):
    response = sessionhub_request('DELETE', f'{session_id}', data={'userId': request.user.id})
    if response and response.get('message') == 'Session deleted successfully':
        return redirect('content:session_list')
    return redirect('content:session_list')  

@login_required
def edit_session(request, session_id):
    """Edit an existing session."""
    if request.method == 'POST':
        # Prepare updated session data from the form
        updated_data = {
            'userId': request.user.id,
            'date': request.POST['date'],
            'location': request.POST['location'],
            'notes': request.POST['notes'],
            'status': request.POST['status'],
        }
        # Send the update request to SessionHub
        response=sessionhub_request('PUT', f'{session_id}', data=updated_data)
        if response:
            return redirect('content:session_list')
    # Fetch session data from SessionHub for pre-filling the form
    session = sessionhub_request('GET', f'{session_id}')
    if session:
            session['id'] = session.pop('_id', None)  # Rename `_id` to `id` if it exists
    return render(request, 'content/session_form.html', {'session': session})

