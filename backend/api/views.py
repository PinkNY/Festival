import jwt
import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.conf import settings
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated  # JWT 인증을 위해 추가
from .models import ActivityLog, Festival, User  # 필요한 모델만 임포트
from .serializers import ActivityLogSerializer, FestivalSerializer, UserSerializer  # 직렬화기 임포트
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging

logger = logging.getLogger(__name__)

class ActivityLogList(generics.ListCreateAPIView):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]  # 인증된 사용자만 접근 가능

class FestivalList(generics.ListCreateAPIView):
    queryset = Festival.objects.all()
    serializer_class = FestivalSerializer
    permission_classes = [IsAuthenticated]  # 인증된 사용자만 접근 가능

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
