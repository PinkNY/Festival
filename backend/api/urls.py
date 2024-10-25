# api/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    ActivityLogList,
    GlobalSettingList,
    StatisticList,
    FestivalList,
    UserList,
)

urlpatterns = [
    path('activity_logs/', ActivityLogList.as_view(), name='activity_logs_list'),
    path('global_settings/', GlobalSettingList.as_view(), name='global_settings_list'),
    path('statistics/', StatisticList.as_view(), name='statistics_list'),
    path('festivals/', FestivalList.as_view(), name='festival_list'),
    path('users/', UserList.as_view(), name='user_list'),
    # JWT 관련 URL 추가
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT 발급
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # JWT 갱신
]
