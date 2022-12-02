# Generated by Django 4.1.1 on 2022-11-16 19:21

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Boards',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('board_name', models.CharField(max_length=50, verbose_name='Имя платы')),
                ('board_password', models.CharField(max_length=50, verbose_name='Пароль')),
                ('board_id', models.CharField(max_length=16, verbose_name='Id платы')),
                ('user_names', models.TextField(editable=False)),
                ('tasks', models.TextField(editable=False)),
            ],
            options={
                'verbose_name': 'плату',
                'verbose_name_plural': 'платы',
            },
        ),
    ]
