# Generated by Django 5.1.6 on 2025-03-03 10:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trips', '0003_rename_dailylogid_dailylog_dailylogid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dailylog',
            name='duty_status',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
