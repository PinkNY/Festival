from django.db import models

class User(models.Model):
    """
    사용자 정보를 저장하는 모델.
    - username: 고유한 사용자 이름
    - password: 사용자 비밀번호
    - name: 사용자 실명
    - email: 사용자 이메일
    - gender: 성별 (M: 남성, F: 여성)
    - date_of_birth: 생년월일
    """
    username = models.CharField(max_length=50, unique=True, null=False, help_text="고유한 사용자 이름")
    password = models.CharField(max_length=255, null=False, help_text="사용자 비밀번호 (암호화된 상태로 저장)")
    name = models.CharField(max_length=100, null=False, help_text="사용자 실명")
    email = models.CharField(max_length=255, null=False, help_text="사용자 이메일 주소")
    gender = models.CharField(
        max_length=1,
        choices=[('M', 'Male'), ('F', 'Female')],
        null=False,
        help_text="성별 (M: 남성, F: 여성)"
    )
    date_of_birth = models.DateField(null=False, help_text="생년월일")

    class Meta:
        db_table = 'users'
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.username} ({self.name})"
