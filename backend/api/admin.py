from django.contrib import admin
from .models import ActivityLog, GlobalSetting, Statistic, Festival, User, Comment, Hashtag, ChatLog

# 모델들을 관리자 페이지에 등록
admin.site.register(ActivityLog)
admin.site.register(GlobalSetting)
admin.site.register(Statistic)
admin.site.register(Festival)
admin.site.register(User)
admin.site.register(Comment)
admin.site.register(Hashtag)
admin.site.register(ChatLog)