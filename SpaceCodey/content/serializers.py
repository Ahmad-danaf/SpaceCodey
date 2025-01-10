from rest_framework import serializers
from .models import Tip, Article


class TipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tip
        fields = ['id', 'title', 'content', 'category', 'created_at']


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'category', 'created_at']
