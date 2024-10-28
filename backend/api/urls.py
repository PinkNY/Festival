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
)

urlpatterns = [
    path('activity_logs/', ActivityLogList.as_view(), name='activity_logs_list'),
    path('festivals/', FestivalList.as_view(), name='festival_list'),
    path('users/', UserList.as_view(), name='user_list'),
    
    # JWT 관련 URL 추가
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT 발급
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),    # JWT 갱신

    #로그인 및 회원가입
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check-auth/', CheckAuthView.as_view(), name='check_auth'),
]
