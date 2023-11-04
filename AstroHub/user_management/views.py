from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from .forms import UserProfileForm,CustomUserCreationForm 
from django.contrib import messages
from .models import Profile


# Create your views here.


# def register(request):
#     if request.method == 'POST':
#         form = UserCreationForm(request.POST)
#         if form.is_valid():
#             user = form.save()
#             login(request, user)  # Log the user in after registration
#             return redirect('profile')  # Redirect to the user's profile page
#         else:
#             # Handle form validation errors
#             for field, error in form.errors.items():
#                 messages.error(request, f"{field}: {error}")

#     else:
#         form = UserCreationForm()

#     return render(request, 'registration/register.html', {'form': form})


def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Create a Profile object and associate it with the user
            profile = Profile(user=user)
            profile.save()
            login(request, user)  # Log the user in after registration
            return redirect('account:profile')  # Redirect to the user's profile page
    else:
        form = CustomUserCreationForm()

    return render(request, 'registration/register.html', {'form': form})



def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            login(request, form.get_user())
            return redirect('account:profile')  # Redirect to the user's profile page after login
        else:
            # Handle form validation errors
            for field, error in form.errors.items():
                messages.error(request, f"{field}: {error}")

    else:
        form = AuthenticationForm()

    return render(request, 'registration/login.html', {'form': form})

def user_logout(request):
    logout(request)
    return redirect('account:login')  # Redirect to the login page after logout


# # # @login_required
# # # def user_profile(request):
# # #     user = request.user
# # #     profile = user.profile
   

# # #     if request.method == 'post':
# # #         profile_form = profileform(request.post, request.files, instance=profile)

# # #         if profile_form.is_valid():
# # #             profile_form.save()  # save the form data to the user's profile
# # #             return redirect('home')

# # #     else:
# # #         profile_form = profileform(instance=profile)

# # #     return render(request, 'user_management/profile.html', {'user': user, 'profile_form': profile_form})

@login_required
def user_profile(request):
    user = request.user
    profile = user.profile

    if request.method == 'POST':
        profile_form = UserProfileForm(request.POST, request.FILES, instance=profile)

        if profile_form.is_valid():
            profile_form.save()  # Save the form data to the user's profile
            # Check if first_name has changed and is not empty
            new_first_name = profile_form.cleaned_data['first_name']
            if new_first_name and new_first_name != user.first_name:
                user.first_name = new_first_name

            # Check if last_name has changed and is not empty
            new_last_name = profile_form.cleaned_data['last_name']
            if new_last_name and new_last_name != user.last_name:
                user.last_name = new_last_name
            user.save()  # Save the user with updated first name and last name
            return redirect('home')

    else:
        profile_form = UserProfileForm(instance=profile)

    return render(request, 'user_management/profile.html', {'user': user, 'profile_form': profile_form, 'profile': profile})

