from django.db import models

# Models for default_db
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


# Models for festival_db
class Festival(models.Model):
    title = models.CharField(max_length=255, null=False)
    start_date = models.DateField(null=False)
    end_date = models.DateField(null=False)
    official_site_url = models.CharField(max_length=255, null=True)
    hashtags = models.TextField(null=True)
    comments = models.TextField(null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True)
    entry_fee = models.CharField(max_length=255, null=True)
    introduction = models.TextField(null=True)
    view_count = models.IntegerField(default=0)
    search_count = models.IntegerField(default=0)

    class Meta:
        db_table = 'festivals'


# Models for user_db
class User(models.Model):
    username = models.CharField(max_length=50, unique=True, null=False)
    password = models.CharField(max_length=255, null=False)
    name = models.CharField(max_length=100, null=False)
    email = models.CharField(max_length=255, null=False)
    gender = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female')], null=False)
    date_of_birth = models.DateField(null=False)

    class Meta:
        db_table = 'users'
