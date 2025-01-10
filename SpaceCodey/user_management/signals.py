from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from .models import CustomUser, Profile

@receiver(post_save, sender=CustomUser)
def create_profile_and_token(sender, instance, created, **kwargs):
    """
    Automatically creates a Profile and Token when a new user is created.
    """
    if created:
        # Create Profile
        Profile.objects.create(user=instance)
        
        # Create Token for API Authentication
        Token.objects.create(user=instance)

    