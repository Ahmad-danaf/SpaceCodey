from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout,get_user_model
from django.contrib import messages
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.conf import settings
from .models import CustomUser, Profile
from .forms import CustomUserCreationForm, CustomAuthenticationForm, ProfileUpdateForm
from django.contrib.auth.decorators import login_required


def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False  # Deactivate account until email is confirmed
            user.save()

            # Send verification email
            send_verification_email(request, user)

            messages.success(request, 'Please confirm your email address to complete the registration.')
            return redirect('account:login')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = CustomUserCreationForm()
    return render(request, 'account/register.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            if user is not None:
                if user.email_verified:  # Check if email is verified
                    login(request, user)
                    messages.success(request, f'Welcome back, {user.username}!')
                    return redirect('home')
                else:
                    messages.error(request, 'Please verify your email address before logging in.')
                    return redirect('account:login')
        else:
            messages.error(request, 'Invalid username or password. Please try again.')
    else:
        form = CustomAuthenticationForm()
    return render(request, 'account/login.html', {'form': form})



def logout_view(request):
    logout(request)
    messages.success(request, 'You have successfully logged out.')
    return redirect('home')


def activate(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = CustomUser.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.email_verified = True
        user.save()
        login(request, user)
        messages.success(request, 'Your account has been activated successfully.')
        return redirect('home')
    else:
        messages.error(request, 'The activation link is invalid.')
        return redirect('home')


def update_profile(request):
    if request.method == 'POST':
        profile_form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user.profile)
        if profile_form.is_valid():
            profile_form.save()
            messages.success(request, 'Your profile was successfully updated!')
            return redirect('home')
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        profile_form = ProfileUpdateForm(instance=request.user.profile)
    return render(request, 'account/update_profile.html', {'profile_form': profile_form})

CustomUser = get_user_model()


def resend_verification(request):
    if request.method == 'POST':
        email = request.POST.get('email')

        # Try to find the user by the provided email
        try:
            user = CustomUser.objects.get(email=email)

            # Check if the user's email is already verified
            if user.email_verified:
                messages.info(request, 'Your email is already verified.')
                return redirect('home')

            # Resend verification email
            send_verification_email(request, user)
            messages.success(request, 'Verification email has been resent to your email address.')
        except CustomUser.DoesNotExist:
            messages.error(request, 'No account found with this email address.')

    return render(request, 'account/resend_verification.html')

def send_verification_email(request, user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    verification_link = f"{request.scheme}://{request.get_host()}/activate/{uid}/{token}/"

    subject = 'Verify Your Email Address'
    message = f"Hi {user.username},\n\nPlease click the following link to verify your email address:\n\n{verification_link}\n\nThank you for registering with us!"

    # Send the email to the user's email address
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )