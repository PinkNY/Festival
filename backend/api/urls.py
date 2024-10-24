from django.urls import path
from . import views

urlpatterns = [
    # 각 테이블에 맞는 엔드포인트
    path('activity_logs/', views.ActivityLogList.as_view(), name='activity_logs_list'),
    path('global_settings/', views.GlobalSettingList.as_view(), name='global_settings_list'),
    path('statistics/', views.StatisticList.as_view(), name='statistics_list'),
    
    path('festivals/', views.FestivalList.as_view(), name='festival_list'),
    
    path('users/', views.UserList.as_view(), name='user_list'),
]
