from django.shortcuts import render, get_object_or_404
from .models import Tip, Article


# Create your views here.

def tips_list(request):
    tips = Tip.objects.all().order_by('-created_at')
    return render(request, 'content/tips_list.html', {'tips': tips})


def tip_detail(request, pk):
    tip = get_object_or_404(Tip, pk=pk)
    return render(request, 'content/tip_detail.html', {'tip': tip})


def articles_list(request):
    articles = Article.objects.all().order_by('-created_at')
    return render(request, 'content/articles_list.html', {'articles': articles})


def article_detail(request, pk):
    article = get_object_or_404(Article, pk=pk)
    return render(request, 'content/article_detail.html', {'article': article})


def tips_articles(request):
    return render(request, 'content/tips_articles.html')
