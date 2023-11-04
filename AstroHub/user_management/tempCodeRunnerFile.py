# # # @login_required
# # # def user_profile(request):
# # #     user = request.user
# # #     profile = user.profile
   

# # #     if request.method == 'POST':
# # #         profile_form = ProfileForm(request.POST, request.FILES, instance=profile)

# # #         if profile_form.is_valid():
# # #             profile_form.save()  # Save the form data to the user's profile
# # #             return redirect('home')

# # #     else:
# # #         profile_form = ProfileForm(instance=profile)

# # #     return render(request, 'user_management/profile.html', {'user': user, 'profile_form': profile_form})