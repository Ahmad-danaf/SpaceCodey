from django.urls import path
from . import views
from .api import *
app_name = 'content'
urlpatterns = [
   
    path('contactUs/', ContactUsAPIView.as_view(), name='contact_us'),
    path('tips/', TipsListAPIView.as_view(), name='tips_list'),
    path('tips/<int:pk>/', TipDetailAPIView.as_view(), name='tip_detail'),
    path('articles/', ArticlesListAPIView.as_view(), name='articles_list'),
    path('articles/<int:pk>/', ArticleDetailAPIView.as_view(), name='article_detail'),
    
    #sessions:
    path('sessions/', SessionListAPIView.as_view(), name='session_list'),
    path('sessions/add/', AddSessionAPIView.as_view(), name='add_session'),
    path('sessions/edit/<str:session_id>/', EditSessionAPIView.as_view(), name='edit_session'),
    path('sessions/delete/<str:session_id>/', DeleteSessionAPIView.as_view(), name='delete_session'),

]
