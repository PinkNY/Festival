from django.db import models

class ChatLog(models.Model):
    user_input = models.TextField() # 사용자의 입력
    chatbot_response = models.TextField()   # 챗봇의 응답
    created_at = models.DateTimeField(auto_now_add=True)    # 생성 시간
    
    class Meta:
        db_table = 'chat_logs'
        app_label = 'api'