from django.http import HttpRequest, HttpResponse
from users.models import Users
from nodemcu.models import Boards
import json


def get_tasks(request: HttpRequest):
    if request.method == 'POST':
        board_id = request.POST.get('board_id')
        widget_id = request.POST.get('widget_id')
        widget_value = request.POST.get('value')

        board = Boards.objects.get(board_id=board_id)
        user_name = board.user_names
        user = Users.objects.get(username=user_name)
        attached_boards = json.loads(user.attached_boards)

        if board_id == attached_boards[int(user.current_board)]:
            widgets = json.loads(user.widgets_json)
            widget_ids = [widget['id'] for widget in widgets]
            widget = widgets[widget_ids.index(widget_id)]
            widget['last_value'] = widget_value
            user.widgets_json = json.dumps(widgets)
            user.save()

        return HttpResponse('ok')

def send_tasks(request: HttpRequest):
    if request.method == 'POST':
        board_id = request.POST.get('board_id')
        board = Boards.objects.get(board_id=board_id)

        aTasks = ''
        tasks = json.loads(board.tasks)
        for task in tasks:
            aTasks += f'{task["type"]},{task["port"]},{task["virtual"]},{task["last_value"]},{task["id"]};'
        board.tasks = '[]'
        board.save()

        return HttpResponse(aTasks)