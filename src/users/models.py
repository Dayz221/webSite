from django.db import models


class Users(models.Model):
    username = models.CharField(max_length=250, verbose_name='Имя')
    userpassword = models.CharField(max_length=250, verbose_name='Пароль')
    lastip = models.CharField(max_length=15, editable=False)
    widgets_json = models.TextField(editable=False)
    attached_boards = models.TextField(editable=False)
    current_board = models.TextField(editable=False)
    tasks = models.TextField(editable=False)

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = 'пользователя'
        verbose_name_plural = 'пользователи'
