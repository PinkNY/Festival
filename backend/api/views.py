from rest_framework import generics
from rest_framework.permissions import IsAuthenticated  # JWT 인증을 위해 추가
from .models import ActivityLog, Festival, User  # 필요한 모델만 임포트
from .serializers import ActivityLogSerializer, FestivalSerializer, UserSerializer  # 직렬화기 임포트

class ActivityLogList(generics.ListCreateAPIView):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]  # 인증된 사용자만 접근 가능

class FestivalList(generics.ListCreateAPIView):
    queryset = Festival.objects.all()
    serializer_class = FestivalSerializer
    permission_classes = [IsAuthenticated]  # 인증된 사용자만 접근 가능

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  # 인증된 사용자만 접근 가능
