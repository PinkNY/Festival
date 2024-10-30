from django.contrib import admin
from django.urls import path, include
from django.conf import settings 
from django.shortcuts import redirect

urlpatterns = [
    path('', lambda request: redirect('/api/'), name='root'),
    path('admin/', admin.site.urls),  # Django 관리자 페이지
    path('api/', include('api.urls')),  # API 앱의 URL을 include하여 연결
    path('api-auth/', include('rest_framework.urls')),  # Browsable API 인증을 위한 URL 추가
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
