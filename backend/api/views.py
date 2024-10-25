# backend/api/views.py

from rest_framework import generics
from .models import ActivityLog, Festival, User  # 모델 임포트
from .serializers import ActivityLogSerializer, FestivalSerializer, UserSerializer  # 직렬화기 임포트

class ActivityLogList(generics.ListCreateAPIView):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer

class FestivalList(generics.ListCreateAPIView):
    queryset = Festival.objects.all()
    serializer_class = FestivalSerializer

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
