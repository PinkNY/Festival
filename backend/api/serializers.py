# backend/api/serializers.py

from rest_framework import serializers
from .models import ActivityLog, Festival, User, Comment, Hashtag, GlobalSetting, Statistic  # 필요한 모델 임포트
from django.contrib.auth.hashers import make_password  # 비밀번호 해싱

class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'  # 모든 필드 포함
        
class GlobalSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalSetting
        fields = '__all__' # 모든 필드 포함
        
        
class StatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statistic
        fields = '__all__' # 모든 필드 포함

class FestivalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Festival
        fields = '__all__'  # 모든 필드 포함

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'  # 모든 필드 포함

class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = '__all__'  # 모든 필드 포함

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # 모든 필드 포함
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)
    