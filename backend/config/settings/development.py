from .base import *

DEBUG = os.getenv('DEBUG', 'True') == 'True'

# 개발 환경에서의 추가 설정
INSTALLED_APPS += [
    'django_extensions',
]

# 개발 서버 데이터베이스 설정 (root 사용자와 비밀번호 1234 사용)
DATABASES['default_db']['USER'] = 'root'
DATABASES['default_db']['PASSWORD'] = '1234'

DATABASES['festival_db']['USER'] = 'root'
DATABASES['festival_db']['PASSWORD'] = '1234'

DATABASES['user_db']['USER'] = 'root'
DATABASES['user_db']['PASSWORD'] = '1234'

DATABASES['chatbot_db']['USER'] = 'root'
DATABASES['chatbot_db']['PASSWORD'] = '1234'