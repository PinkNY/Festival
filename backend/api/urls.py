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
    CommentListCreateView, 
    HashtagListCreateView,
    FestivalDetailView,
    FestivalSearchView,
    ChatWithBotView, # 챗봇과 상호작용할 뷰 추가
    # SortedFestivalsView,
    # SortedFestivalsSearch,
)

urlpatterns = [
    path('activity_logs/', ActivityLogList.as_view(), name='activity_logs_list'),
    path('festivals/', FestivalList.as_view(), name='festival_list'),
    path('users/', UserList.as_view(), name='user_list'),
    path('comments/', CommentListCreateView.as_view(), name='comment_list_create'),  # 댓글
    path('hashtags/', HashtagListCreateView.as_view(), name='hashtag_list_create'),  # 해시태그
    path('festivals/<int:pk>/', FestivalDetailView.as_view(), name='festival-detail'),  # 조회
    path('festivals/search/', FestivalSearchView.as_view(), name='festival-search'),  # 검색
    
    # JWT 관련 URL 추가
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT 발급
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # JWT 갱신

    # 로그인 및 회원가입
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check-auth/', CheckAuthView.as_view(), name='check_auth'),

    # 챗봇과 상호작용하는 URL 추가
    path('chat_with_bot/<int:festival_id>/', ChatWithBotView.as_view(), name='chat_with_bot'),  # 챗봇 엔드포인트 추가

    # path('festivals_view/', SortedFestivalsView.as_view(), name='sorted_festivals_view'),
    # path('festivals_search/', SortedFestivalsSearch.as_view(), name='sorted_festivals_search'),
]
