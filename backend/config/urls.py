from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.http import HttpResponse

# 간단한 홈 페이지 뷰
def home_view(request):
    return HttpResponse("Welcome to the Festival API. Please refer to the API documentation for available endpoints.")

urlpatterns = [
    path('', home_view, name='home'),  # 루트 URL 처리
    path('admin/', admin.site.urls),  # Django 관리자 페이지
    path('api/', include('api.urls')),  # API 앱의 URL을 include하여 연결
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
