import jwt
import datetime
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.conf import settings
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated  # JWT 인증을 위해 추가
from .models import ActivityLog, Festival, User, Comment, Hashtag, ChatLog  # 필요한 모델만 임포트
from .serializers import ActivityLogSerializer, FestivalSerializer, UserSerializer, CommentSerializer, HashtagSerializer  # 직렬화기 임포트
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging
from rest_framework import permissions
from django.db.models import Q

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
    
#축제 카운트 뷰
class FestivalDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            festival = Festival.objects.get(pk=pk)
            # 조회수 증가
            festival.view_count += 1
            festival.save()

            serializer = FestivalSerializer(festival)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Festival.DoesNotExist:
            return Response({'error': 'Festival not found'}, status=status.HTTP_404_NOT_FOUND)
    
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

#검색뷰
class FestivalSearchView(APIView):
    def get(self, request):
        query = request.GET.get('query', '')

        if query:
            # 1. 해시태그 DB에서 title 또는 tag에 검색어가 포함된 해시태그 조회
            hashtags = Hashtag.objects.filter(
                Q(title__icontains=query) | Q(tag__icontains=query)
            )
            
            # 2. 검색된 해시태그에서 관련된 festa_id 목록 추출
            festival_ids = hashtags.values_list('festa_id', flat=True)
            
            # 3. festivals DB에서 festival_ids에 해당하는 페스티벌 조회
            festivals = Festival.objects.filter(id__in=festival_ids)
            
            # 4. 조회된 페스티벌 데이터를 직렬화하여 반환
            serialized_festivals = FestivalSerializer(festivals, many=True)
            return Response(serialized_festivals.data, status=status.HTTP_200_OK)

        # 검색어가 없으면 빈 배열 반환
        return Response([], status=status.HTTP_200_OK)

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


# 챗봇과 상호작용하는 뷰 추가
class ChatWithBotView(APIView):
    def post(self, request):
        user_input = request.data.get("input", "")
        if not user_input:
            return Response({"error": "No input provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 챗봇 API 호출
            url = f"{settings.CHATBOT_API_URL}/chat"
            response = requests.post(url, json={"input": user_input})
            response_data = response.json()

            # 대화 기록 저장
            chatbot_response = response_data.get("response", "")
            ChatLog.objects.create(user_input=user_input, chatbot_response=chatbot_response)

            return Response({"response": chatbot_response}, status=status.HTTP_200_OK)
        except requests.exceptions.RequestException as e:
            logger.error(f"Error communicating with chatbot: {e}")
            return Response({"error": "Failed to communicate with chatbot"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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