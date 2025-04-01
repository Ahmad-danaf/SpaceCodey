from django.urls import path
from .api import *
from .views import activate
from rest_framework_simplejwt.views import TokenRefreshView
app_name = 'account'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('activate/<str:uidb64>/<str:token>/', activate, name='activate'),
    path('resend-verification/', ResendVerificationView.as_view(), name='resend_verification'),


]
