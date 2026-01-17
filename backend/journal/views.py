# journal/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import JournalEntry, SentimentAnalysis, MoodSuggestion
from .serializers import (
    JournalEntrySerializer, 
    JournalEntryCreateSerializer,
    SentimentAnalysisSerializer
)
from .utils import AIForthaiSentimentAnalyzer, generate_mood_suggestion
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods


class JournalEntryListCreateView(generics.ListCreateAPIView):
    """
    API endpoint สำหรับดูรายการและสร้าง journal entry
    """
    permission_classes = (IsAuthenticated,)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JournalEntryCreateSerializer
        return JournalEntrySerializer
    
    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user).prefetch_related('sentiment', 'suggestions')
    
    @swagger_auto_schema(
        operation_description="ดูรายการ journal entries ทั้งหมด",
        responses={200: JournalEntrySerializer(many=True)}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="สร้าง journal entry ใหม่ พร้อมวิเคราะห์อารมณ์",
        request_body=JournalEntryCreateSerializer,
        responses={
            201: JournalEntrySerializer,
            400: 'ข้อมูลไม่ถูกต้อง'
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # สร้าง journal entry
        entry = serializer.save(user=request.user)
        
        # วิเคราะห์อารมณ์ผ่าน AI for Thai
        analyzer = AIForthaiSentimentAnalyzer()
        sentiment_result = analyzer.analyze(entry.content)
        
        # บันทึกผลการวิเคราะห์
        sentiment = SentimentAnalysis.objects.create(
            entry=entry,
            **sentiment_result
        )
        
        # สร้างคำแนะนำ
        suggestion_text = generate_mood_suggestion(
            sentiment.sentiment_label,
            float(sentiment.sentiment_score)
        )
        
        MoodSuggestion.objects.create(
            entry=entry,
            suggestion=suggestion_text
        )
        
        # ส่ง response กลับ
        output_serializer = JournalEntrySerializer(entry)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

class JournalEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint สำหรับดู แก้ไข และลบ journal entry
    """
    serializer_class = JournalEntrySerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user)
    
    @swagger_auto_schema(
        operation_description="ดูรายละเอียด journal entry",
        responses={200: JournalEntrySerializer}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="แก้ไข journal entry และ re-analyze sentiment",
        responses={200: JournalEntrySerializer}
    )
    def put(self, request, *args, **kwargs):
        entry = self.get_object()
        serializer = self.get_serializer(entry, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Re-analyze sentiment ผ่าน AI for Thai เมื่อแก้ไข
        analyzer = AIForthaiSentimentAnalyzer()
        sentiment_result = analyzer.analyze(entry.content)
        
        # อัพเดท sentiment
        sentiment = entry.sentiment
        if sentiment:
            sentiment.sentiment_label = sentiment_result['sentiment_label']
            sentiment.sentiment_score = sentiment_result['sentiment_score']
            sentiment.save()
        else:
            # ถ้าไม่มี sentiment ให้สร้างใหม่
            sentiment = SentimentAnalysis.objects.create(
                entry=entry,
                **sentiment_result
            )
        
        # อัพเดท suggestion
        suggestion_text = generate_mood_suggestion(
            sentiment.sentiment_label,
            float(sentiment.sentiment_score)
        )
        
        # ลบ suggestion เก่าและสร้างใหม่
        entry.suggestions.all().delete()
        MoodSuggestion.objects.create(
            entry=entry,
            suggestion=suggestion_text
        )
        
        output_serializer = JournalEntrySerializer(entry)
        return Response(output_serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(
        operation_description="ลบ journal entry",
        responses={204: 'ลบสำเร็จ'}
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)

class MoodStatisticsView(APIView):
    """
    API endpoint สำหรับดูสถิติอารมณ์
    """
    permission_classes = (IsAuthenticated,)
    
    @swagger_auto_schema(
        operation_description="ดูสถิติอารมณ์ในช่วง 30 วันที่ผ่านมา",
        manual_parameters=[
            openapi.Parameter('days', openapi.IN_QUERY, description="จำนวนวันย้อนหลัง (default: 30)", type=openapi.TYPE_INTEGER)
        ],
        responses={
            200: openapi.Response(
                description="สถิติอารมณ์",
                examples={
                    "application/json": {
                        "total_entries": 15,
                        "sentiment_distribution": {
                            "positive": 8,
                            "neutral": 4,
                            "negative": 3
                        },
                        "daily_sentiments": [
                            {
                                "date": "2024-01-01",
                                "sentiment_label": "positive",
                                "sentiment_score": 0.75
                            }
                        ],
                        "average_sentiment": 0.25
                    }
                }
            )
        }
    )
    def get(self, request):
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        
        entries = JournalEntry.objects.filter(
            user=request.user,
            created_at__gte=start_date
        ).select_related('sentiment')
        
        # นับจำนวน sentiment แต่ละประเภท
        sentiment_dist = entries.values('sentiment__sentiment_label').annotate(
            count=Count('id')
        )
        
        sentiment_distribution = {
            'positive': 0,
            'neutral': 0,
            'negative': 0
        }
        
        for item in sentiment_dist:
            label = item.get('sentiment__sentiment_label')
            if label:
                sentiment_distribution[label] = item['count']
        
        # รายละเอียดแต่ละวัน
        daily_sentiments = []
        for entry in entries:
            if hasattr(entry, 'sentiment') and entry.sentiment:
                daily_sentiments.append({
                    'date': entry.created_at.strftime('%Y-%m-%d'),
                    'sentiment_label': entry.sentiment.sentiment_label,
                    'sentiment_score': float(entry.sentiment.sentiment_score),
                    'title': entry.title or 'ไม่มีหัวเรื่อง'
                })
        
        # คะแนนเฉลี่ย
        sentiments_with_score = entries.filter(sentiment__isnull=False)
        if sentiments_with_score.exists():
            avg_sentiment = sum(
                float(e.sentiment.sentiment_score) for e in sentiments_with_score
            ) / sentiments_with_score.count()
        else:
            avg_sentiment = 0.0
        
        return Response({
            'total_entries': entries.count(),
            'sentiment_distribution': sentiment_distribution,
            'daily_sentiments': daily_sentiments,
            'average_sentiment': round(avg_sentiment, 4),
            'period_days': days
        })
    
 