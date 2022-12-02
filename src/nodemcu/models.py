from tabnanny import verbose
from django.db import models


class Boards(models.Model):
    board_name = models.CharField(max_length=50, verbose_name='Имя платы')
    board_password = models.CharField(max_length=50, verbose_name='Пароль')
    board_id = models.CharField(max_length=16, verbose_name='Id платы')
    user_names = models.TextField(editable=False)
    tasks = models.TextField(editable=False)

    def __str__(self):
        return self.board_id

    class Meta:
        verbose_name = 'плату'
        verbose_name_plural = 'платы'
