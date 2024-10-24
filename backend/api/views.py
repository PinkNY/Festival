from rest_framework import generics
from .models import ActivityLog, GlobalSetting, Statistic, Festival, User
from .serializers import ActivityLogSerializer, GlobalSettingSerializer, StatisticSerializer, FestivalSerializer, UserSerializer

# 기본 데이터베이스 테이블들
class ActivityLogList(generics.ListCreateAPIView):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer

class GlobalSettingList(generics.ListCreateAPIView):
    queryset = GlobalSetting.objects.all()
    serializer_class = GlobalSettingSerializer

class StatisticList(generics.ListCreateAPIView):
    queryset = Statistic.objects.all()
    serializer_class = StatisticSerializer

# Festival 데이터베이스
class FestivalList(generics.ListCreateAPIView):
    queryset = Festival.objects.all()
    serializer_class = FestivalSerializer

# User 데이터베이스
class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
