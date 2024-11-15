import jwt
import datetime
import requests
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from django.contrib.auth.hashers import check_password
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Q
import logging
import traceback

from .models import ActivityLog, Festival, User, Comment, Hashtag, ChatLog
from .serializers import ActivityLogSerializer, FestivalSerializer, UserSerializer, CommentSerializer, HashtagSerializer, ChatLogSerializer

# 로거 설정
logger = logging.getLogger('api.views')

class ActivityLogList(generics.ListCreateAPIView):
    """
    사용자 활동 로그를 조회하고 생성하는 뷰.
    인증된 사용자만 접근할 수 있습니다.
    """
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        logger.info("Fetching all activity logs.")
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        logger.info("Creating a new activity log.")
        return super().create(request, *args, **kwargs)


class FestivalList(generics.ListCreateAPIView):
    """
    축제 리스트를 조회하고 생성하는 뷰.
    특정 필터 조건(예: 알파벳 순)으로 정렬할 수 있습니다.
    """
    serializer_class = FestivalSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Festival.objects.all()
        filter_type = self.request.query_params.get('filter')
        if filter_type == 'alphabetical':
            queryset = queryset.order_by('title')
            logger.info("Fetching festivals ordered alphabetically.")
        else:
            logger.info("Fetching all festivals.")
        return queryset

    def create(self, request, *args, **kwargs):
        logger.info("Creating a new festival entry.")
        return super().create(request, *args, **kwargs)


class FestivalDetailView(APIView):
    """
    특정 축제 정보를 조회하는 뷰. 조회 시 조회수를 증가시킵니다.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        """
        특정 ID(pk)에 해당하는 축제를 조회하고 조회수를 증가시킵니다.
        """
        try:
            festival = Festival.objects.get(pk=pk)
            festival.view_count += 1
            festival.save()
            serializer = FestivalSerializer(festival)
            logger.info(f"Fetched festival with ID {pk}. View count incremented.")
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Festival.DoesNotExist:
            logger.warning(f"Festival with ID {pk} not found.")
            return Response({'error': 'Festival not found'}, status=status.HTTP_404_NOT_FOUND)


class CommentListCreateView(generics.ListCreateAPIView):
    """
    댓글을 조회하고 생성하는 뷰.
    최근 작성된 댓글을 우선 조회할 수 있는 필터 기능이 있습니다.
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Comment.objects.all()
        filter_type = self.request.query_params.get('filter')
        if filter_type == 'recent':
            queryset = queryset.order_by('-id')
            logger.info("Fetching comments ordered by most recent.")
        else:
            logger.info("Fetching all comments.")
        return queryset

    def create(self, request, *args, **kwargs):
        logger.info("Creating a new comment.")
        return super().create(request, *args, **kwargs)


class HashtagListCreateView(generics.ListCreateAPIView):
    """
    해시태그를 조회하고 생성하는 뷰.
    알파벳 순으로 정렬할 수 있는 필터 기능이 있습니다.
    """
    serializer_class = HashtagSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Hashtag.objects.all()
        filter_type = self.request.query_params.get('filter')
        if filter_type == 'alphabetical':
            queryset = queryset.order_by('tag')
            logger.info("Fetching hashtags ordered alphabetically.")
        else:
            logger.info("Fetching all hashtags.")
        return queryset

    def create(self, request, *args, **kwargs):
        logger.info("Creating a new hashtag.")
        return super().create(request, *args, **kwargs)


class FestivalSearchView(APIView):
    """
    해시태그를 이용하여 축제를 검색하는 뷰.
    """
    def get(self, request):
        query = request.GET.get('query', '')
        if query:
            hashtags = Hashtag.objects.filter(Q(title__icontains=query) | Q(tag__icontains=query))
            festival_ids = hashtags.values_list('festa_id', flat=True)
            festivals = Festival.objects.filter(id__in=festival_ids)
            serialized_festivals = FestivalSerializer(festivals, many=True)
            logger.info(f"Searching festivals with query '{query}'. Found {len(festivals)} results.")
            return Response(serialized_festivals.data, status=status.HTTP_200_OK)
        logger.info("Festival search query was empty.")
        return Response([], status=status.HTTP_200_OK)


class UserList(generics.ListCreateAPIView):
    """
    사용자 정보를 조회하고 생성하는 뷰.
    인증된 사용자만 접근할 수 있습니다.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        logger.info("Fetching all users.")
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        logger.info("Creating a new user.")
        return super().create(request, *args, **kwargs)


class SignupView(APIView):
    """
    사용자 회원가입을 처리하는 뷰.
    """
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info("New user signup successful.")
            return Response({'message': '회원가입이 성공적으로 완료되었습니다.'}, status=status.HTTP_201_CREATED)
        logger.error("Signup failed due to validation errors.")
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    """
    사용자 로그인을 처리하는 뷰.
    """
    def post(self, request):
        data = request.data
        username = data.get('username')
        password = data.get('password')
        try:
            user = User.objects.get(username=username)
            if check_password(password, user.password):
                refresh = RefreshToken.for_user(user)
                logger.info(f"User {username} logged in successfully.")
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            else:
                logger.warning(f"Failed login attempt for user {username}.")
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            logger.warning(f"Failed login attempt for nonexistent user {username}.")
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    """
    사용자 로그아웃을 처리하는 뷰.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logger.info("User logged out successfully.")
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


class CheckAuthView(APIView):
    """
    사용자 인증 상태를 확인하는 뷰.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        logger.info("Authenticated user checked.")
        return Response({'message': 'User is authenticated'}, status=status.HTTP_200_OK)


class ChatWithBotView(APIView):
    """
    사용자 입력을 받아 챗봇과 상호작용하는 뷰.
    """
    def post(self, request):
        # 사용자 입력값 가져오기
        user_input = request.data.get("input_user", "").strip()
        
        # 사용자 입력이 없는 경우 기본 응답 처리
        if not user_input:
            logger.warning("ChatWithBotView: No input provided by user.")
            return Response(
                {"error": "No input provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # 챗봇 API 호출
            url = settings.CHATBOT_API_URL
            response = requests.post(url, json={"input_user": user_input})
            response.raise_for_status()
            response_data = response.json()

            # 챗봇 응답 처리
            chatbot_response = response_data.get("response", "No response from chatbot.")
            chat_log = ChatLog(user_input=user_input, chatbot_response=chatbot_response)
            chat_log.save()

            logger.info(f"ChatWithBotView: Successfully retrieved chatbot response: {chatbot_response}")
            return Response(
                {"response": chatbot_response},
                status=status.HTTP_200_OK
            )

        except requests.exceptions.RequestException as e:
            # 챗봇 API 호출 오류 처리
            logger.error(
                f"ChatWithBotView: Error communicating with chatbot API."
                f"\nURL: {url}"
                f"\nUser Input: {user_input}"
                f"\nException: {e}"
                f"\nTraceback: {traceback.format_exc()}"
            )
            return Response(
                {"error": "Failed to communicate with chatbot"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        except Exception as e:
            # 기타 예상치 못한 오류 처리
            logger.error(
                f"ChatWithBotView: Unexpected error occurred."
                f"\nUser Input: {user_input}"
                f"\nException: {e}"
                f"\nTraceback: {traceback.format_exc()}"
            )
            return Response(
                {"error": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ChatLogListView(ListAPIView):
    """
    저장된 챗봇 대화 로그를 조회하는 뷰.
    """
    queryset = ChatLog.objects.all()
    serializer_class = ChatLogSerializer

    def list(self, request, *args, **kwargs):
        logger.info("Fetching all chat logs.")
        return super().list(request, *args, **kwargs)


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