# backend/config/settings/development.py

from .base import *

DEBUG = True  # 개발 시 디버그 모드

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('DB_NAME', default='default_db'),
        'USER': env('DB_USER', default='root'),
        'PASSWORD': env('DB_PASSWORD', default='your_password'),
        'HOST': 'localhost',
        'PORT': '3306',
    },
    'festival_db': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('FESTIVAL_DB_NAME', default='festival_db'),
        'USER': env('DB_USER', default='root'),
        'PASSWORD': env('DB_PASSWORD', default='your_password'),
        'HOST': 'localhost',
        'PORT': '3306',
    },
    'user_db': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('USER_DB_NAME', default='user_db'),
        'USER': env('DB_USER', default='root'),
        'PASSWORD': env('DB_PASSWORD', default='your_password'),
        'HOST': 'localhost',
        'PORT': '3306',
    },
}

# CORS 설정
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',  # React 앱의 로컬 주소
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = ['content-type', 'authorization']
CORS_ALLOW_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
CSRF_TRUSTED_ORIGINS = ['http://localhost:3000']

# Django Debug Toolbar 설정
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
    INTERNAL_IPS = ["127.0.0.1"]
