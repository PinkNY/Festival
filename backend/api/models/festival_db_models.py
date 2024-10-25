# api/models/festival_db_models.py

from django.db import models

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
