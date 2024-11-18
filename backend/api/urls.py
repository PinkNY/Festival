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
    ChatWithBotView,  # 챗봇과 상호작용할 뷰 추가
    ChatLogListView,
    ChatbotAPIView,
    # SortedFestivalsView,
    # SortedFestivalsSearch,
)

# URL 패턴 정의
urlpatterns = [
    # 활동 로그 관련 URL
    path('activity_logs/', ActivityLogList.as_view(), name='activity_logs_list'),  # 활동 로그 리스트 및 생성

    # 축제 관련 URL
    path('festivals/', FestivalList.as_view(), name='festival_list'),  # 축제 리스트 및 생성
    path('festivals/<int:pk>/', FestivalDetailView.as_view(), name='festival-detail'),  # 특정 축제 상세 정보
    path('festivals/search/', FestivalSearchView.as_view(), name='festival-search'),  # 축제 검색

    # 사용자 관련 URL
    path('users/', UserList.as_view(), name='user_list'),  # 사용자 리스트 및 생성

    # 댓글 및 해시태그 관련 URL
    path('comments/', CommentListCreateView.as_view(), name='comment_list_create'),  # 댓글 리스트 및 생성
    path('hashtags/', HashtagListCreateView.as_view(), name='hashtag_list_create'),  # 해시태그 리스트 및 생성

    # JWT 인증 관련 URL
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT 액세스 토큰 발급
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # JWT 액세스 토큰 갱신

    # 인증 및 회원 관리 URL
    path('signup/', SignupView.as_view(), name='signup'),  # 회원가입
    path('login/', LoginView.as_view(), name='login'),  # 로그인
    path('logout/', LogoutView.as_view(), name='logout'),  # 로그아웃
    path('check-auth/', CheckAuthView.as_view(), name='check_auth'),  # 인증 상태 확인

    # 챗봇 관련 URL
    path('chat_with_bot/', ChatWithBotView.as_view(), name='chat_with_bot'),  # 챗봇과 상호작용
    path('chatlogs/', ChatLogListView.as_view(), name='chat_log_list'),  # 챗봇 대화 로그 조회
    path("restaurant_chatbot/", ChatbotAPIView.as_view(), name="restaurant_chatbot"), # 맛집챗봇

    # # 정렬된 축제 관련 URL (추후 필요 시 활성화)
    # path('festivals_view/', SortedFestivalsView.as_view(), name='sorted_festivals_view'),  # 정렬된 축제 리스트 조회
    # path('festivals_search/', SortedFestivalsSearch.as_view(), name='sorted_festivals_search'),  # 정렬된 축제 검색
]
