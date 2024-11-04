from django.db import models

class Festival(models.Model):
    title = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    official_site_url = models.CharField(max_length=255, blank=True, null=True)
    entry_fee = models.CharField(max_length=100, blank=True, null=True)
    introduction = models.TextField(blank=True, null=True)
    view_count = models.IntegerField(default=0, blank=True, null=True)
    search_count = models.IntegerField(default=0, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    imageUrl = models.CharField(max_length=500, blank=True, null=True)  # imageUrl 필드 추가

    class Meta:
        db_table = 'festivals'