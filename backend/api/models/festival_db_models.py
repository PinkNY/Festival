from django.db import models

class Festival(models.Model):
    """
    축제 정보를 저장하는 모델.
    - title: 축제 제목
    - start_date: 축제 시작 날짜
    - end_date: 축제 종료 날짜
    - official_site_url: 축제 공식 사이트 URL
    - entry_fee: 입장료 정보
    - introduction: 축제 소개
    - view_count: 축제 조회수
    - search_count: 축제 검색 횟수
    - address: 축제 장소 주소
    - imageUrl: 축제 이미지 URL
    - intro_image1, intro_image2, intro_image3: 축제 소개 이미지 URL
    """
    title = models.CharField(max_length=255, help_text="축제 제목")
    start_date = models.DateField(help_text="축제 시작 날짜")
    end_date = models.DateField(help_text="축제 종료 날짜")
    official_site_url = models.CharField(max_length=255, blank=True, null=True, help_text="축제 공식 사이트 URL")
    entry_fee = models.CharField(max_length=100, blank=True, null=True, help_text="입장료 정보")
    introduction = models.TextField(blank=True, null=True, help_text="축제 소개")
    view_count = models.IntegerField(default=0, blank=True, null=True, help_text="축제 조회수")
    search_count = models.IntegerField(default=0, blank=True, null=True, help_text="축제 검색 횟수")
    address = models.CharField(max_length=255, blank=True, null=True, help_text="축제 장소 주소")
    imageUrl = models.CharField(max_length=500, blank=True, null=True, help_text="축제 이미지 URL")
    intro_image1 = models.CharField(max_length=500, blank=True, null=True, help_text="축제 소개 이미지 URL 1")
    intro_image2 = models.CharField(max_length=500, blank=True, null=True, help_text="축제 소개 이미지 URL 2")
    intro_image3 = models.CharField(max_length=500, blank=True, null=True, help_text="축제 소개 이미지 URL 3")

    class Meta:
        db_table = 'festivals'
        verbose_name = "Festival"
        verbose_name_plural = "Festivals"

    def __str__(self):
        return f"{self.title} ({self.start_date} - {self.end_date})"


class Comment(models.Model):
    """
    축제에 대한 사용자 댓글을 저장하는 모델.
    - festa: 축제 외래 키
    - title: 댓글 제목
    - username: 사용자 이름
    - comment: 댓글 내용
    - rating: 축제에 대한 사용자 평점
    """
    festa = models.ForeignKey(Festival, on_delete=models.CASCADE, help_text="댓글이 작성된 축제")
    title = models.CharField(max_length=255, help_text="댓글 제목")
    username = models.CharField(max_length=255, help_text="사용자 이름")
    comment = models.TextField(help_text="댓글 내용")
    rating = models.IntegerField(help_text="사용자 평점")

    class Meta:
        db_table = 'comments'
        verbose_name = "Comment"
        verbose_name_plural = "Comments"

    def __str__(self):
        return f"{self.title} by {self.username} (Rating: {self.rating})"


class Hashtag(models.Model):
    """
    축제에 연결된 해시태그를 저장하는 모델.
    - festa: 축제 외래 키
    - title: 해시태그 제목
    - tag: 해시태그 텍스트
    """
    festa = models.ForeignKey(Festival, on_delete=models.CASCADE, help_text="해시태그가 연결된 축제")
    title = models.CharField(max_length=255, help_text="해시태그 제목")
    tag = models.CharField(max_length=100, help_text="해시태그 내용")

    class Meta:
        db_table = 'hashtags'
        verbose_name = "Hashtag"
        verbose_name_plural = "Hashtags"

    def __str__(self):
        return f"#{self.tag} for {self.title}"
