from django.db import models

class ChatLog(models.Model):
    """
    사용자가 입력한 질문과 챗봇의 응답을 저장하는 모델.
    - user_input: 사용자가 입력한 텍스트
    - chatbot_response: 챗봇이 생성한 응답 텍스트
    - created_at: 로그가 생성된 시간
    """
    user_input = models.TextField(help_text="사용자가 입력한 텍스트")
    chatbot_response = models.TextField(help_text="챗봇이 생성한 응답 텍스트")
    created_at = models.DateTimeField(auto_now_add=True, help_text="로그가 생성된 시간")

    class Meta:
        db_table = 'chat_logs'
        app_label = 'api'
        verbose_name = "Chat Log"
        verbose_name_plural = "Chat Logs"

    def __str__(self):
        return f"User Input: {self.user_input[:20]} | Chatbot Response: {self.chatbot_response[:20]} (Created at {self.created_at})"
