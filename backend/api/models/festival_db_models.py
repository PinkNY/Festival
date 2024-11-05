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
    imageUrl = models.CharField(max_length=500, blank=True, null=True)
    intro_image1 = models.CharField(max_length=500, blank=True, null=True)  # 새 URL 필드
    intro_image2 = models.CharField(max_length=500, blank=True, null=True)  # 새 URL 필드
    intro_image3 = models.CharField(max_length=500, blank=True, null=True)  # 새 URL 필드

    class Meta:
        db_table = 'festivals'



class Comment(models.Model):
    festa = models.ForeignKey('Festival', on_delete=models.CASCADE)  # 외래키 설정
    title = models.CharField(max_length=255)
    username = models.CharField(max_length=255)
    comment = models.TextField()
    rating = models.IntegerField()  # 별점 필드

    class Meta:
        db_table = 'comments'



class Hashtag(models.Model):
    festa = models.ForeignKey('Festival', on_delete=models.CASCADE)  # 축제 ID 외래 키
    title = models.CharField(max_length=255)
    tag = models.CharField(max_length=100)  # 해시태그 필드

    class Meta:
        db_table = 'hashtags'