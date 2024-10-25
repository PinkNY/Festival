# api/models/user_db_models.py

from django.db import models

class User(models.Model):
    username = models.CharField(max_length=50, unique=True, null=False)
    password = models.CharField(max_length=255, null=False)
    name = models.CharField(max_length=100, null=False)
    email = models.CharField(max_length=255, null=False)
    gender = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female')], null=False)
    date_of_birth = models.DateField(null=False)

    class Meta:
        db_table = 'users'
