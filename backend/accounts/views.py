# accounts/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer, UserSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    """
    API endpoint สำหรับสมัครสมาชิก
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer
    
    @swagger_auto_schema(
        operation_description="สมัครสมาชิกใหม่",
        responses={
            201: openapi.Response('สมัครสมาชิกสำเร็จ', UserSerializer),
            400: 'ข้อมูลไม่ถูกต้อง'
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'user': UserSerializer(user).data,
            'message': 'สมัครสมาชิกสำเร็จ'
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint สำหรับดูและแก้ไขข้อมูลผู้ใช้
    """
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    
    def get_object(self):
        return self.request.user
    
    @swagger_auto_schema(
        operation_description="ดูข้อมูลโปรไฟล์ของตัวเอง",
        responses={200: UserSerializer}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="แก้ไขข้อมูลโปรไฟล์",
        responses={200: UserSerializer}
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    

def put(self, request, *args, **kwargs):
    user = self.get_object()
    data = request.data
    if data.get('password'):
        user.set_password(data['password'])
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.email = data.get('email', user.email)
    user.save()
    return Response(UserSerializer(user).data)