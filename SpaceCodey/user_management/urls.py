from django.urls import path
from .api import *

app_name = 'account'

urlpatterns = [
    # Registration and Email Verification
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('activate/<str:uidb64>/<str:token>/', ActivateAccountAPIView.as_view(), name='activate'),
    path('resend-verification/', ResendVerificationEmailAPIView.as_view(), name='resend_verification'),

    # Authentication
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),

    # Profile
    path('profile/', ProfileAPIView.as_view(), name='profile'),
]
