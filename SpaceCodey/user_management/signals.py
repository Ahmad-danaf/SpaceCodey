from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser, Profile

@receiver(post_save, sender=CustomUser)
def create_or_save_user_profile(sender, instance, created, **kwargs):
    """
    Creates or saves a user profile whenever a CustomUser instance is created or saved.
    """
    if created:
        Profile.objects.get_or_create(user=instance)  # Only create if it doesn't already exist
    else:
        if hasattr(instance, 'profile'):
            instance.profile.save()
        else:
            Profile.objects.create(user=instance)  # Create a profile if one doesn't exist
