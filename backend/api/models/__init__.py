# backend/api/models/__init__.py

from .default_db_models import ActivityLog, GlobalSetting, Statistic
from .festival_db_models import Festival, Comment, Hashtag
from .user_db_models import User
from .chatbot_db_models import ChatLog  # ChatLog 모델이 정의된 파일에서 import