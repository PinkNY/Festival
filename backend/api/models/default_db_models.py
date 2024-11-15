from django.db import models

class ActivityLog(models.Model):
    """
    사용자 활동 로그를 저장하는 모델.
    - user_id: 활동을 수행한 사용자 ID
    - activity_type: 활동 유형(예: 로그인, 로그아웃 등)
    - activity_time: 활동이 발생한 시간
    - description: 활동에 대한 상세 설명
    """
    user_id = models.IntegerField(null=True, blank=True, help_text="활동을 수행한 사용자 ID")
    activity_type = models.CharField(max_length=255, null=True, blank=True, help_text="활동 유형 (예: 로그인)")
    activity_time = models.DateTimeField(auto_now_add=True, help_text="활동 발생 시간")
    description = models.TextField(null=True, blank=True, help_text="활동에 대한 설명")

    class Meta:
        db_table = 'activity_logs'
        verbose_name = "Activity Log"
        verbose_name_plural = "Activity Logs"

    def __str__(self):
        return f"Activity {self.activity_type} by User {self.user_id} at {self.activity_time}"


class GlobalSetting(models.Model):
    """
    전역 설정을 저장하는 모델.
    - setting_key: 설정의 키(고유값)
    - setting_value: 설정의 값
    """
    setting_key = models.CharField(max_length=255, unique=True, null=True, blank=True, help_text="설정 키")
    setting_value = models.CharField(max_length=255, null=True, blank=True, help_text="설정 값")

    class Meta:
        db_table = 'global_settings'
        verbose_name = "Global Setting"
        verbose_name_plural = "Global Settings"

    def __str__(self):
        return f"{self.setting_key}: {self.setting_value}"


class Statistic(models.Model):
    """
    통계를 저장하는 모델.
    - stat_type: 통계 유형(예: 사용자 수, 페이지 조회수 등)
    - stat_value: 통계 값
    - updated_at: 마지막 업데이트 시간
    """
    stat_type = models.CharField(max_length=255, null=True, blank=True, help_text="통계 유형 (예: 사용자 수)")
    stat_value = models.IntegerField(default=0, help_text="통계 값")
    updated_at = models.DateTimeField(auto_now=True, help_text="마지막 업데이트 시간")

    class Meta:
        db_table = 'statistics'
        verbose_name = "Statistic"
        verbose_name_plural = "Statistics"

    def __str__(self):
        return f"{self.stat_type}: {self.stat_value} (Updated at {self.updated_at})"
