# accounts/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserRegistrationView, UserProfileView
from django.views.generic import TemplateView

app_name = 'accounts'

urlpatterns = [
    # JWT Authentication
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User management
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),

    # หน้าแก้ไขโปรไฟล์ (template)
    path('edit_profile/', TemplateView.as_view(template_name='edit_profile.html'), name='edit_profile'),
]