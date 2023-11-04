from django import forms
from .models import Profile,CustomUser
from django.contrib.auth.forms import UserCreationForm


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['profile_picture', 'bio']
    
    # Additional fields from the User model
    first_name = forms.CharField(max_length=30, required=False)
    last_name = forms.CharField(max_length=30, required=False)

    # If you want to add custom validation or modify form fields, you can do so here:
    # Example:
    # bio = forms.CharField(widget=forms.Textarea(attrs={'rows': 4, 'cols': 40}), required=False)


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = UserCreationForm.Meta.fields + ('email',)