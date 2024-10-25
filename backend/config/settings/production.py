# backend/config/settings/production.py

from .base import *
import os

DEBUG = False  # 배포 시 디버그 모드

ALLOWED_HOSTS = ['backend-hnbte6c6gqaxfuh9.koreacentral-01.azurewebsites.net', '.azurewebsites.net']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('DB_NAME', default='default_db'),
        'USER': env('DB_USER', default='skdudgns'),
        'PASSWORD': env('DB_PASSWORD', default='9P@ssw0rd'),
        'HOST': env('DB_HOST', default='teamdatabase.mysql.database.azure.com'),
        'PORT': env('DB_PORT', default='3306'),
        'OPTIONS': {
            'ssl': {'ssl-mode': 'DISABLED'},
        },
    },
    'festival_db': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('FESTIVAL_DB_NAME', default='festival_db'),
        'USER': env('DB_USER', default='skdudgns'),
        'PASSWORD': env('DB_PASSWORD', default='9P@ssw0rd'),
        'HOST': env('DB_HOST', default='teamdatabase.mysql.database.azure.com'),
        'PORT': env('DB_PORT', default='3306'),
        'OPTIONS': {
            'ssl': {'ssl-mode': 'DISABLED'},
        },
    },
    'user_db': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('USER_DB_NAME', default='user_db'),
        'USER': env('DB_USER', default='skdudgns'),
        'PASSWORD': env('DB_PASSWORD', default='9P@ssw0rd'),
        'HOST': env('DB_HOST', default='teamdatabase.mysql.database.azure.com'),
        'PORT': env('DB_PORT', default='3306'),
        'OPTIONS': {
            'ssl': {'ssl-mode': 'DISABLED'},
        },
    },
}

# CORS 설정
CORS_ALLOWED_ORIGINS = [
    'https://mango-forest-0aeaf0e00.5.azurestaticapps.net',  # 배포된 React 앱의 주소
]

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# backend/config/settings/production.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'django_project.log'),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
