# Generated by Django 2.0.7 on 2018-08-02 23:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lunch', '0003_auto_20180802_2259'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='address2',
            field=models.CharField(blank=True, max_length=20),
        ),
    ]
