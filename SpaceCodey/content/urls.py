from django.urls import path
from . import views

app_name = 'content'
urlpatterns = [
    path('tips/', views.tips_list, name='tips_list'),
    path('tips/<int:pk>/', views.tip_detail, name='tip_detail'),
    path('articles/', views.articles_list, name='articles_list'),
    path('articles/<int:pk>/', views.article_detail, name='article_detail'),
    path('tipsAndArticles/', views.tips_articles, name='tips_articles'),
    path('contactUs/', views.contact_us, name='contact_us'),
    path('support/', views.SupportMeView.as_view(), name='support_me'),

]
