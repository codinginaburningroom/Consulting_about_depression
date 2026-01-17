# journal/admin.py

from django.contrib import admin
from .models import JournalEntry, SentimentAnalysis, MoodSuggestion

@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'created_at', 'updated_at')
    list_filter = ('created_at', 'user')
    search_fields = ('title', 'content', 'user__username')
    date_hierarchy = 'created_at'

@admin.register(SentimentAnalysis)
class SentimentAnalysisAdmin(admin.ModelAdmin):
    list_display = ('id', 'entry', 'sentiment_label', 'sentiment_score', 'confidence', 'analyzed_at')
    list_filter = ('sentiment_label', 'analyzed_at')
    search_fields = ('entry__content',)

@admin.register(MoodSuggestion)
class MoodSuggestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'entry', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('suggestion', 'entry__content')