from django.urls import path
from . import views


urlpatterns = [
    path('', views.page),
    path('get_widgets', views.get_widgets),
    path('get_boards', views.get_boards),
    path('update_data', views.update_data),
    path('send_tasks', views.get_tasks),
    path('add_board', views.add_user_board),
    path('delete_board', views.delete_user_board),
    path('set_cur_board', views.set_cur_board),
]
