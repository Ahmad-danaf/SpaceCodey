from django import forms
from .models import Profile

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['profile_picture', 'bio']

    # If you want to add custom validation or modify form fields, you can do so here:
    # Example:
    # bio = forms.CharField(widget=forms.Textarea(attrs={'rows': 4, 'cols': 40}), required=False)
