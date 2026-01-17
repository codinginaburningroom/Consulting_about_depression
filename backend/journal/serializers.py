# journal/serializers.py

from rest_framework import serializers
from .models import JournalEntry, SentimentAnalysis, MoodSuggestion

class SentimentAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentimentAnalysis
        fields = ('id', 'sentiment_score', 'sentiment_label', 'confidence', 'analyzed_at')
        read_only_fields = ('id', 'analyzed_at')

class MoodSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodSuggestion
        fields = ('id', 'suggestion', 'created_at')
        read_only_fields = ('id', 'created_at')

class JournalEntrySerializer(serializers.ModelSerializer):
    sentiment = SentimentAnalysisSerializer(read_only=True)
    suggestions = MoodSuggestionSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = JournalEntry
        fields = ('id', 'user', 'title', 'content', 'created_at', 'updated_at', 'sentiment', 'suggestions')
        read_only_fields = ('id', 'created_at', 'updated_at', 'user')

class JournalEntryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ('title', 'content')