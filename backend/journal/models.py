# journal/models.py
from django.db import models
from django.conf import settings

class JournalEntry(models.Model):
    """
    Model สำหรับเก็บบันทึก journal ของผู้ใช้
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='journal_entries'
    )
    title = models.CharField(max_length=200, blank=True, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Journal Entry'
        verbose_name_plural = 'Journal Entries'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title or 'No title'} ({self.created_at.strftime('%Y-%m-%d')})"


class SentimentAnalysis(models.Model):
    """
    Model สำหรับเก็บผลการวิเคราะห์อารมณ์
    """
    entry = models.OneToOneField(
        JournalEntry,
        on_delete=models.CASCADE,
        related_name='sentiment'  # ← สำคัญมาก! ต้องชื่อ 'sentiment'
    )
    sentiment_score = models.DecimalField(
        max_digits=5,
        decimal_places=4,
        help_text='คะแนนอารมณ์ (-1.0 ถึง 1.0)'
    )
    sentiment_label = models.CharField(
        max_length=20,
        choices=[
            ('positive', 'Positive'),
            ('neutral', 'Neutral'),
            ('negative', 'Negative'),
        ]
    )
    confidence = models.DecimalField(
        max_digits=5,
        decimal_places=4,
        default=0.0,
        help_text='ความมั่นใจในการวิเคราะห์'
    )
    raw_response = models.JSONField(null=True, blank=True)
    analyzed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Sentiment Analysis'
        verbose_name_plural = 'Sentiment Analyses'
    
    def __str__(self):
        return f"{self.entry.title or 'No title'} - {self.sentiment_label} ({self.sentiment_score})"


class MoodSuggestion(models.Model):
    """
    Model สำหรับเก็บคำแนะนำตามอารมณ์
    """
    entry = models.ForeignKey(
        JournalEntry,
        on_delete=models.CASCADE,
        related_name='suggestions'  # ← สำคัญ! ต้องชื่อ 'suggestions'
    )
    suggestion = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Mood Suggestion'
        verbose_name_plural = 'Mood Suggestions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Suggestion for {self.entry.title or 'No title'}"