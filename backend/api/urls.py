# api/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    ActivityLogList,
    FestivalList,
    UserList,
    SignupView,
    LoginView, 
    LogoutView, 
    CheckAuthView,
    ApiRootView,  # 추가
)

urlpatterns = [
    path('', ApiRootView.as_view(), name='api_root'),  # 기본 경로 추가
    path('activity_logs/', ActivityLogList.as_view(), name='activity_logs_list'),
    path('festivals/', FestivalList.as_view(), name='festival_list'),
    path('users/', UserList.as_view(), name='user_list'),
    
    # JWT 관련 URL
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 로그인 및 회원가입
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check-auth/', CheckAuthView.as_view(), name='check_auth'),
]
