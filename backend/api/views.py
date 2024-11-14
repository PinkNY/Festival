import jwt
import datetime
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.conf import settings
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import ActivityLog, Festival, User, Comment, Hashtag, ChatLog
from .serializers import ActivityLogSerializer, FestivalSerializer, UserSerializer, CommentSerializer, HashtagSerializer
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
    permission_classes = [IsAuthenticated]

class FestivalList(generics.ListCreateAPIView):
    serializer_class = FestivalSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Festival.objects.all()
        filter_type = self.request.query_params.get('filter')
        if filter_type == 'alphabetical':
            queryset = queryset.order_by('title')
        return queryset
    
class FestivalDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            festival = Festival.objects.get(pk=pk)
            festival.view_count += 1
            festival.save()
            serializer = FestivalSerializer(festival)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Festival.DoesNotExist:
            return Response({'error': 'Festival not found'}, status=status.HTTP_404_NOT_FOUND)
    
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Comment.objects.all()
        filter_type = self.request.query_params.get('filter')
        if filter_type == 'recent':
            queryset = queryset.order_by('-id')
        return queryset

class HashtagListCreateView(generics.ListCreateAPIView):
    serializer_class = HashtagSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Hashtag.objects.all()
        filter_type = self.request.query_params.get('filter')
        if filter_type == 'alphabetical':
            queryset = queryset.order_by('tag')
        return queryset

class FestivalSearchView(APIView):
    def get(self, request):
        query = request.GET.get('query', '')
        if query:
            hashtags = Hashtag.objects.filter(Q(title__icontains=query) | Q(tag__icontains=query))
            festival_ids = hashtags.values_list('festa_id', flat=True)
            festivals = Festival.objects.filter(id__in=festival_ids)
            serialized_festivals = FestivalSerializer(festivals, many=True)
            return Response(serialized_festivals.data, status=status.HTTP_200_OK)
        return Response([], status=status.HTTP_200_OK)

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': '회원가입이 성공적으로 완료되었습니다.'}, status=status.HTTP_201_CREATED)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

class CheckAuthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'User is authenticated'}, status=status.HTTP_200_OK)

# 챗봇과 상호작용하는 뷰
class ChatWithBotView(APIView):
    def post(self, request):
        # 사용자 입력 받기
        user_input = request.data.get("input_user", "")
        if not user_input:
            return Response({"error": "No input provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 챗봇 API URL 가져오기
            url = settings.CHATBOT_API_URL

            # 챗봇에 POST 요청 보내기
            response = requests.post(url, json={"input_user": user_input})
            response_data = response.json()

            # 챗봇 응답 확인 및 반환
            chatbot_response = response_data.get("response", "")
            return Response({"response": chatbot_response}, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            # 오류 로깅 및 응답
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