# backend/api/serializers.py

from rest_framework import serializers
from .models import ActivityLog, Festival, User  # 필요한 모델만 임포트

class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'  # 모든 필드 포함

class FestivalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Festival
        fields = '__all__'  # 모든 필드 포함

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # 모든 필드 포함
