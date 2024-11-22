class MyDBRouter:
    """
    여러 데이터베이스에 걸친 모델의 데이터베이스 작업을 제어하는 라우터.
    각 모델에 대해 읽기/쓰기 작업을 특정 데이터베이스로 라우팅합니다.
    """

    def db_for_read(self, model, **hints):
        """
        모델에 따라 읽기 작업을 적절한 데이터베이스로 라우팅합니다.
        """
        if model._meta.app_label == 'api':
            if model.__name__ == 'User':
                return 'default'  # 기본 인증 시스템을 위해 User는 기본 DB 사용
            elif model.__name__ == 'Festival':
                return 'festival_db'
            elif model.__name__ == 'ChatLog':
                return 'chatbot_db'
            elif model.__name__ in ['Comment', 'Hashtag']:
                return 'festival_db'
            elif model.__name__ == 'UserLog':
                return 'user_db'
            else:
                return 'default'
        return 'default'

    def db_for_write(self, model, **hints):
        """
        모델에 따라 쓰기 작업을 적절한 데이터베이스로 라우팅합니다.
        """
        if model._meta.app_label == 'api':
            if model.__name__ == 'User':
                return 'default'  # 기본 인증 시스템을 위해 User는 기본 DB 사용
            elif model.__name__ == 'Festival':
                return 'festival_db'
            elif model.__name__ == 'ChatLog':
                return 'chatbot_db'
            elif model.__name__ in ['Comment', 'Hashtag']:
                return 'festival_db'
            elif model.__name__ == 'UserLog':
                return 'user_db'
            else:
                return 'default'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        두 객체가 같은 데이터베이스에 있다면 관계를 허용합니다.
        """
        if obj1._state.db == obj2._state.db:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        모델에 따라 마이그레이션을 적절한 데이터베이스에만 허용합니다.
        """
        if app_label == 'api':
            # 기본 User 모델은 default에 마이그레이션
            if model_name == 'user':
                return db == 'default'
            # festival_db에 속하는 모델
            elif model_name in ['festival', 'comment', 'hashtag']:
                return db == 'festival_db'
            # user_db에 속하는 사용자 로그나 통계 정보
            elif model_name == 'userlog':
                return db == 'user_db'
            # chatbot_db에 속하는 모델
            elif model_name == 'chatlog':
                return db == 'chatbot_db'
            # 그 외 기본 앱들
            elif model_name in ['activitylog', 'globalsetting', 'statistic']:
                return db == 'default'
        # 기본 Django 앱들은 default 데이터베이스에 마이그레이션
        elif app_label in ['auth', 'admin', 'contenttypes', 'sessions']:
            return db == 'default'
        return None
