from django.urls import path
from . import views


urlpatterns = [
    path('get_tasks', views.send_tasks),
    path('send_tasks', views.get_tasks),
]
