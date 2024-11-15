from rest_framework import serializers
from .models import ActivityLog, Festival, User, Comment, Hashtag, ChatLog
from django.contrib.auth.hashers import make_password

class ActivityLogSerializer(serializers.ModelSerializer):
    """
    사용자 활동 로그 시리얼라이저
    """
    class Meta:
        model = ActivityLog
        fields = ['id', 'user_id', 'activity_type', 'activity_time', 'description']  # 명시적으로 필드 나열


class FestivalSerializer(serializers.ModelSerializer):
    """
    축제 정보 시리얼라이저
    """
    class Meta:
        model = Festival
        fields = [
            'id', 'title', 'start_date', 'end_date', 'official_site_url',
            'entry_fee', 'introduction', 'view_count', 'search_count',
            'address', 'imageUrl', 'intro_image1', 'intro_image2', 'intro_image3'
        ]


class CommentSerializer(serializers.ModelSerializer):
    """
    축제에 대한 사용자 댓글 시리얼라이저
    """
    class Meta:
        model = Comment
        fields = ['id', 'festa', 'title', 'username', 'comment', 'rating']

    def validate_rating(self, value):
        """
        rating 필드 유효성 검사 - 1에서 5 사이의 값만 허용
        """
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


class HashtagSerializer(serializers.ModelSerializer):
    """
    축제와 관련된 해시태그 시리얼라이저
    """
    class Meta:
        model = Hashtag
        fields = ['id', 'festa', 'title', 'tag']


class UserSerializer(serializers.ModelSerializer):
    """
    사용자 정보 시리얼라이저
    """
    password = serializers.CharField(write_only=True, required=True, help_text="사용자 비밀번호")
    email = serializers.EmailField(required=True, help_text="사용자 이메일 주소")

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'name', 'email', 'gender', 'date_of_birth']

    def validate_password(self, value):
        """
        비밀번호 유효성 검사 - 최소 길이와 강도 검사
        """
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return make_password(value)

    def create(self, validated_data):
        validated_data['password'] = self.validate_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)


class ChatLogSerializer(serializers.ModelSerializer):
    """
    사용자와 챗봇의 대화 로그 시리얼라이저
    """
    class Meta:
        model = ChatLog
        fields = ['id', 'user_input', 'chatbot_response', 'created_at']
