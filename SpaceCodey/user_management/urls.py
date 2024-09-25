from django.urls import path
from . import views

app_name='account'

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('activate/<uidb64>/<token>/', views.activate, name='activate'),
    path('profile/', views.update_profile, name='update_profile'),
    path('resend-verification/', views.resend_verification, name='resend_verification'),

]
