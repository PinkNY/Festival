class MyDBRouter:
    """
    A router to control database operations for different models across multiple databases.
    """

    def db_for_read(self, model, **hints):
        """Directs read queries for specific models to their respective databases."""
        if model._meta.app_label == 'api':
            if model.__name__ == 'Festival':
                return 'festival_db'
            elif model.__name__ == 'User':
                return 'user_db'
            elif model.__name__ in ['Comment', 'Hashtag']:  # 추가된 부분
                return 'festival_db'  # Comment와 Hashtag는 festival_db로 설정
            else:
                return 'default'
        return 'default'

    def db_for_write(self, model, **hints):
        """Directs write queries for specific models to their respective databases."""
        if model._meta.app_label == 'api':
            if model.__name__ == 'Festival':
                return 'festival_db'
            elif model.__name__ == 'User':
                return 'user_db'
            elif model.__name__ in ['Comment', 'Hashtag']:  # 추가된 부분
                return 'festival_db'  # Comment와 Hashtag는 festival_db로 설정
            else:
                return 'default'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """Allow relations if both objects are in the same database."""
        if obj1._state.db == obj2._state.db:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """Ensure models migrate only to their appropriate databases."""
        if app_label == 'api':
            if model_name in ['festival', 'comment', 'hashtag']:  # 추가된 부분
                return db == 'festival_db'  # Comment와 Hashtag를 festival_db에 추가
            elif model_name == 'user':
                return db == 'user_db'
            elif model_name in ['activitylog', 'globalsetting', 'statistic']:
                return db == 'default'
        elif app_label in ['auth', 'admin', 'contenttypes', 'sessions']:
            return db == 'default'
        return None