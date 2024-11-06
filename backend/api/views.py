import jwt
import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.conf import settings
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated  # JWT 인증을 위해 추가
from .models import ActivityLog, Festival, User, Comment, Hashtag  # 필요한 모델만 임포트
from .serializers import ActivityLogSerializer, FestivalSerializer, UserSerializer, CommentSerializer, HashtagSerializer  # 직렬화기 임포트
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging
from rest_framework import permissions

logger = logging.getLogger(__name__)

class ActivityLogList(generics.ListCreateAPIView):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]  # 인증된 사용자만 접근 가능

class FestivalList(generics.ListCreateAPIView):
    serializer_class = FestivalSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # 기본적으로 모든 축제를 가져옵니다.
        queryset = Festival.objects.all()

        # 요청 파라미터에서 filter 값을 가져옵니다.
        filter_type = self.request.query_params.get('filter')

        # 필터 타입이 'alphabetical'인 경우 축제 이름 기준으로 정렬합니다.
        if filter_type == 'alphabetical':
            queryset = queryset.order_by('title')  # 축제 이름을 기준으로 가나다순 정렬

        return queryset
    
# 축제 댓글
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]  # 인증된 사용자만 접근 가능

    def get_queryset(self):
        # 기본적으로 모든 댓글을 가져옵니다.
        queryset = Comment.objects.all()

        # 요청 파라미터에서 filter 값을 가져옵니다.
        filter_type = self.request.query_params.get('filter')

        # 필터 타입이 'recent'인 경우 최신 댓글 순으로 정렬합니다.
        if filter_type == 'recent':
            queryset = queryset.order_by('-id')  # id를 기준으로 내림차순 정렬 (최신 순)

        return queryset

# 해시태그
class HashtagListCreateView(generics.ListCreateAPIView):
    serializer_class = HashtagSerializer
    permission_classes = [permissions.AllowAny]  # 인증된 사용자만 접근 가능

    def get_queryset(self):
        # 기본적으로 모든 해시태그를 가져옵니다.
        queryset = Hashtag.objects.all()

        # 요청 파라미터에서 filter 값을 가져옵니다.
        filter_type = self.request.query_params.get('filter')

        # 필터 타입이 'alphabetical'인 경우 해시태그 이름 기준으로 정렬합니다.
        if filter_type == 'alphabetical':
            queryset = queryset.order_by('tag')  # 해시태그(tag)를 기준으로 알파벳순 정렬

        return queryset

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  # 인증된 사용자만 접근 가능

# 회원가입 뷰 (클래스 기반)
class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': '회원가입이 성공적으로 완료되었습니다.'}, status=status.HTTP_201_CREATED)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# 로그인 뷰
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        data = request.data
        username = data.get('username')
        password = data.get('password')
        
        try:
            user = User.objects.get(username=username)
            if check_password(password, user.password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# 로그아웃 뷰 (JWT 방식에서는 주로 클라이언트 측에서 토큰을 삭제하는 방식)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

# 로그인 상태 확인 뷰
class CheckAuthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'User is authenticated'}, status=status.HTTP_200_OK)


# #축제뷰
# class SortedFestivalsView(APIView):
#     permission_classes = [permissions.AllowAny]

#     def get(self, request):
#         sort_field = request.GET.get('sort', 'view_count')
#         order = request.GET.get('order', 'desc')
#         limit = int(request.GET.get('limit', 5))

#         if order == 'desc':
#             sort_field = f'-{sort_field}'

#         festivals = Festival.objects.all().order_by(sort_field)[:limit]
#         serializer = FestivalSerializer(festivals, many=True)
#         return Response(serializer.data)

# class SortedFestivalsSearch(APIView):
#     permission_classes = [permissions.AllowAny]

#     def get(self, request):
#         sort_field = request.GET.get('sort', 'search_count')
#         order = request.GET.get('order', 'desc')
#         limit = int(request.GET.get('limit', 5))

#         if order == 'desc':
#             sort_field = f'-{sort_field}'

#         festivals = Festival.objects.all().order_by(sort_field)[:limit]
#         serializer = FestivalSerializer(festivals, many=True)
#         return Response(serializer.data)