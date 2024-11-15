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
            if model.__name__ == 'Festival':
                return 'festival_db'
            elif model.__name__ == 'User':
                return 'user_db'
            elif model.__name__ == 'ChatLog':
                return 'chatbot_db'
            elif model.__name__ in ['Comment', 'Hashtag']:
                return 'festival_db'
            else:
                return 'default'
        return 'default'

    def db_for_write(self, model, **hints):
        """
        모델에 따라 쓰기 작업을 적절한 데이터베이스로 라우팅합니다.
        """
        if model._meta.app_label == 'api':
            if model.__name__ == 'Festival':
                return 'festival_db'
            elif model.__name__ == 'User':
                return 'user_db'
            elif model.__name__ == 'ChatLog':
                return 'chatbot_db'
            elif model.__name__ in ['Comment', 'Hashtag']:
                return 'festival_db'
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
            # festival_db에 속하는 모델
            if model_name in ['festival', 'comment', 'hashtag']:
                return db == 'festival_db'
            # user_db에 속하는 모델
            elif model_name == 'user':
                return db == 'user_db'
            # chatbot_db에 속하는 모델
            elif model_name == 'chatlog':
                return db == 'chatbot_db'
            # default 데이터베이스에 속하는 모델
            elif model_name in ['activitylog', 'globalsetting', 'statistic']:
                return db == 'default'
        # 기본 Django 앱은 default 데이터베이스로 마이그레이션
        elif app_label in ['auth', 'admin', 'contenttypes', 'sessions']:
            return db == 'default'
        return None
