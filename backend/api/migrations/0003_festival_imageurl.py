# Generated by Django 5.1.2 on 2024-11-04 06:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_festival_comments_remove_festival_hashtags_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='festival',
            name='imageUrl',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]
