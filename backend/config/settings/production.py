from .base import *

DEBUG = os.getenv('DEBUG', 'False') == 'True'

# 운영 환경에서의 보안 설정
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# Azure MySQL 데이터베이스 설정 (skdudgns 사용자와 비밀번호 9P@ssw0rd 사용)
DATABASES['default_db']['USER'] = 'root'
DATABASES['default_db']['PASSWORD'] = 'skdudgns1234'

DATABASES['festival_db']['USER'] = 'root'
DATABASES['festival_db']['PASSWORD'] = 'skdudgns1234'

DATABASES['user_db']['USER'] = 'root'
DATABASES['user_db']['PASSWORD'] = 'skdudgns1234'

DATABASES['chatbot_db']['USER'] = 'root'
DATABASES['chatbot_db']['PASSWORD'] = 'skdudgns1234'