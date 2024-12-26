from django.shortcuts import render, get_object_or_404
from .models import Tip, Article
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages
from django.views.generic import TemplateView

# Create your views here.

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


import requests
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.conf import settings

# Base URL of the SessionHub API
SESSIONHUB_API_BASE_URL = "http://localhost:5000/api/sessions"

@login_required
def session_list(request):
    """Fetch and display all sessions for the logged-in user."""
    try:
        response = requests.get(
            SESSIONHUB_API_BASE_URL,
            cookies=request.COOKIES,  # Pass Django cookies for authentication
        )
        if response.status_code == 200:
            sessions = response.json()
            # Convert `_id` to `id` for Django template compatibility
            for session in sessions:
                session['id'] = session.pop('_id')
        else:
            sessions = []
    except requests.exceptions.RequestException as e:
        print(f"Error fetching sessions: {e}")
        sessions = []

    return render(request, 'content/session_list.html', {'sessions': sessions})


@login_required
def add_session(request):
    """Add a new session."""
    if request.method == 'POST':
        session_data = {
            'date': request.POST.get('date'),
            'location': request.POST.get('location'),
            'notes': request.POST.get('notes'),
            'sessionType': 'log',  # Default value
            'status': 'upcoming',  # Default value
        }
        try:
            response = requests.post(
                SESSIONHUB_API_BASE_URL,
                json=session_data,
                cookies=request.COOKIES,  # Pass Django cookies for authentication
                headers={'X-CSRFToken': request.COOKIES.get('csrftoken')},
            )
            if response.status_code == 201:
                return redirect('content:session_list')
        except requests.exceptions.RequestException as e:
            print(f"Error adding session: {e}")

    return render(request, 'content/session_form.html')

@login_required
def delete_session(request, session_id):
    """Delete a session."""
    try:
        response = requests.delete(
            f"{SESSIONHUB_API_BASE_URL}/{session_id}",
            cookies=request.COOKIES,  # Pass Django cookies for authentication
        )
        if response.status_code == 200:
            return redirect('content:session_list')
    except requests.exceptions.RequestException as e:
        print(f"Error deleting session: {e}")

    return redirect('content:session_list')

@login_required
def edit_session(request, session_id):
    """Edit an existing session."""
    if request.method == 'POST':
        updated_data = {
            'date': request.POST.get('date'),
            'location': request.POST.get('location'),
            'notes': request.POST.get('notes'),
            'status': request.POST.get('status'),
        }
        try:
            response = requests.put(
                f"{SESSIONHUB_API_BASE_URL}/{session_id}",
                json=updated_data,
                cookies=request.COOKIES,  # Pass Django cookies for authentication
                headers={'X-CSRFToken': request.COOKIES.get('csrftoken')},
            )
            if response.status_code == 200:
                return redirect('content:session_list')
        except requests.exceptions.RequestException as e:
            print(f"Error updating session: {e}")

    # Fetch existing session data to prepopulate the form
    try:
        response = requests.get(
            f"{SESSIONHUB_API_BASE_URL}/{session_id}",
            cookies=request.COOKIES,  # Pass Django cookies for authentication
        )
        session = response.json() if response.status_code == 200 else None
    except requests.exceptions.RequestException as e:
        print(f"Error fetching session: {e}")
        session = None

    return render(request, 'content/session_form.html', {'session': session})
