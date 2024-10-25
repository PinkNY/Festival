class MyDBRouter:
    """
    A router to control database operations for different models across multiple databases.
    """
    def db_for_read(self, model, **hints):
        """Directs read queries for specific models to their respective databases."""
        if model._meta.app_label == 'festival':
            return 'festival_db'
        if model._meta.app_label == 'user':
            return 'user_db'
        return 'default'

    def db_for_write(self, model, **hints):
        """Directs write queries for specific models to their respective databases."""
        if model._meta.app_label == 'festival':
            return 'festival_db'
        if model._meta.app_label == 'user':
            return 'user_db'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """Allow relations only if both models are from the same database."""
        db_obj1 = self.db_for_read(obj1)
        db_obj2 = self.db_for_read(obj2)
        if db_obj1 and db_obj2:
            return db_obj1 == db_obj2
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """Ensure models migrate only to the appropriate database."""
        if app_label == 'festival':
            return db == 'festival_db'
        if app_label == 'user':
            return db == 'user_db'
        return db == 'default'
