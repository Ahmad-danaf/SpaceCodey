from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from .forms import ProfileForm  # Import the ProfileForm
from django.contrib import messages


# Create your views here.


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # Log the user in after registration
            return redirect('profile')  # Redirect to the user's profile page
        else:
            # Handle form validation errors
            for field, error in form.errors.items():
                messages.error(request, f"{field}: {error}")

    else:
        form = UserCreationForm()

    return render(request, 'registration/register.html', {'form': form})


def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            login(request, form.get_user())
            return redirect('profile')  # Redirect to the user's profile page after login
        else:
            # Handle form validation errors
            for field, error in form.errors.items():
                messages.error(request, f"{field}: {error}")

    else:
        form = AuthenticationForm()

    return render(request, 'registration/login.html', {'form': form})

def user_logout(request):
    logout(request)
    return redirect('login')  # Redirect to the login page after logout


@login_required
def user_profile(request):
    user = request.user
    profile = user.profile  

    if request.method == 'POST':
        profile_form = ProfileForm(request.POST, request.FILES, instance=profile)

        if profile_form.is_valid():
            profile_form.save()  # Save the form data to the user's profile
            return redirect('home')

    else:
        profile_form = ProfileForm(instance=profile)

    return render(request, 'user_management/profile.html', {'user': user, 'profile_form': profile_form})