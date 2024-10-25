# api/models/default_db_models.py

from django.db import models

class ActivityLog(models.Model):
    user_id = models.IntegerField(null=True)
    activity_type = models.CharField(max_length=255, null=True)
    activity_time = models.DateTimeField(auto_now_add=True)
    description = models.TextField(null=True)

    class Meta:
        db_table = 'activity_logs'

class GlobalSetting(models.Model):
    setting_key = models.CharField(max_length=255, unique=True, null=True)
    setting_value = models.CharField(max_length=255, null=True)

    class Meta:
        db_table = 'global_settings'

class Statistic(models.Model):
    stat_type = models.CharField(max_length=255, null=True)
    stat_value = models.IntegerField(null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'statistics'
