from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings


def send_verification_email(request, user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    verification_link = f"{request.scheme}://{request.get_host()}/api/account/activate/{uid}/{token}/"

    subject = 'Verify Your Email Address'
    message = f"Hi {user.username},\n\nPlease click the link below to verify your email address:\n\n{verification_link}\n\nThank you!"

    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
    except Exception as e:
        # Log error or take necessary action
        print(f"Error sending email: {e}")