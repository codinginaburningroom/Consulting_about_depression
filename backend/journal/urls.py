# journal/urls.py

from django.urls import path
from .views import (
    JournalEntryListCreateView,
    JournalEntryDetailView,
    MoodStatisticsView
)

app_name = 'journal'

urlpatterns = [
    path('entries/', JournalEntryListCreateView.as_view(), name='entry-list-create'),
    path('entries/<int:pk>/', JournalEntryDetailView.as_view(), name='entry-detail'),
    path('entries/<int:pk>/edit/', JournalEntryDetailView.as_view(), name='entry-edit'),
    path('statistics/', MoodStatisticsView.as_view(), name='statistics'),
]