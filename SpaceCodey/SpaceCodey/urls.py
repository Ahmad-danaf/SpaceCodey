"""SpaceCodey URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,re_path,include
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('landing-page',views.LandingPage.as_view(),name='landing-page'),
    re_path(r"^$", views.HomePage.as_view(), name="home"),
    path('',include('user_management.urls', namespace='account')),
    path('',include('events.urls', namespace='events')),
    path('',include('weather.urls', namespace='weather')),
    path('',include('nasa_info.urls', namespace='nasa')),
    path('content/', include('content.urls')),
    path("ckeditor5/", include('django_ckeditor_5.urls')),
    path('api/check-auth/', views.check_auth, name='check_auth'),

]

# serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)