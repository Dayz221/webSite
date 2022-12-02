import json
from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse
from users.models import Users
from nodemcu.models import Boards


def page(request: HttpRequest):
    if Users.objects.filter(lastip=get_user_ip(request)).count() > 0:
        return render(request, 'main/index_page.html')

    else:
        return redirect('auth/')


def get_widgets(request: HttpRequest):
    ip = get_user_ip(request)
    user = Users.objects.get(lastip=ip)
    widgets = user.widgets_json
    return HttpResponse(widgets)


def get_boards(request: HttpRequest):
    ip = get_user_ip(request)
    user = Users.objects.get(lastip=ip)
    boards = json.loads(user.attached_boards)
    answer = []

    for i in range(len(boards)):
        board_id = boards[i]
        board = Boards.objects.get(board_id=board_id)
        isCurrent = (int(user.current_board) == i)
        answer.append({
            "board_name": board.board_name,
            "board_id": board_id,
            "isCurrent": isCurrent,
        })

    return HttpResponse(json.dumps(answer))


def delete_user_board(request: HttpRequest):
    ip = get_user_ip(request)
    user = Users.objects.get(lastip=ip)

    if request.method == 'POST':
        board_id = request.POST.get('board_id')
        boards = json.loads(user.attached_boards)

        if board_id in boards:
            if boards.index(board_id) + 1 == len(boards):
                user.current_board = max(0, len(boards) - 2)

            boards.pop(boards.index(board_id))
            user.attached_boards = json.dumps(boards)
            user.save()

        return HttpResponse('ok')
    
    return HttpResponse('fail')


def add_user_board(request: HttpRequest):
    ip = get_user_ip(request)
    user = Users.objects.get(lastip=ip)

    if request.method == 'POST':
        board_id = request.POST.get('board_id')
        board_password = request.POST.get('board_password')

        if Boards.objects.filter(board_id=board_id).count() > 0:
            board = Boards.objects.get(board_id=board_id)

            if board_password == board.board_password:
                board.user_names = user.username
                board.save()

                boards = json.loads(user.attached_boards)
                if not (board.board_id in boards):
                    boards.append(board.board_id)
                user.attached_boards = json.dumps(boards)
                user.save()

                return HttpResponse('ok')

    return HttpResponse('board id or password is incorrect')


def set_cur_board(request: HttpRequest):
    ip = get_user_ip(request)
    user = Users.objects.get(lastip=ip)

    if request.method == 'POST':
        board_id = request.POST.get('board_id')
        boards = json.loads(user.attached_boards)
        if board_id in boards:
            user.current_board = str(boards.index(board_id))
            user.save()
        
        return HttpResponse('ok')

    return HttpResponse('fail')

# def register_user_board(request: HttpRequest):
#     ip = get_user_ip(request)
#     user = Users.objects.get(lastip=ip)

#     if request.method == 'POST':
#         board_name = request.POST.get('board_name')
#         board_id = request.POST.get('board_id')
#         board_password = request.POST.get('board_password')

#         if Boards.objects.filter(board_name=board_name).count() == 0:
#             Boards.objects.create(board_name=board_name, board_id=board_id, board_password=board_password, user_names=f"[{user.username}]")
#             board = Boards.objects.get(board_id=board_id)
#             boards = json.loads(user.attached_boards)
#             boards.append(board.board_id)
#             user.attached_boards = json.dumps(boards)
#             user.save()
#             return HttpResponse("ok")

#         else:
#             return HttpResponse('board name alredy in use')

#     else:
#         return HttpResponse('fail')


def update_data(request: HttpRequest):
    ip = get_user_ip(request)
    user = Users.objects.get(lastip=ip)

    if request.method == 'POST':
        json = request.POST.get('json')
        user.widgets_json = json
        user.save()
        return HttpResponse('ok')

    return HttpResponse('fail')


def get_tasks(request: HttpRequest):
    ip = get_user_ip(request)
    user = Users.objects.get(lastip=ip)
    
    if request.method == 'POST':
        tasks = json.loads(request.POST.get('tasks'))
        widgets = json.loads(user.widgets_json)
        widgets_id = [widget['id'] for widget in widgets]

        for id in tasks.keys():
            task = tasks[id]
            widget = widgets[widgets_id.index(id)]

            widget['last_value'] = task
            attachedBoards = json.loads(user.attached_boards)
            if attachedBoards != []:
                board_id = attachedBoards[int(user.current_board)]

                if Boards.objects.filter(board_id=board_id).count() > 0:
                    board = Boards.objects.get(board_id=board_id)
                    if board.tasks == "": board.tasks = '[]'
                    # board.save()
                    board_tasks = json.loads(board.tasks)
                    flag = False
                    id = ''

                    for j in range(len(board_tasks)):
                        task_ = board_tasks[j]
                        if task_['id'] == widget['id']:
                            flag = True
                            id = j

                    widget_ = {
                        'type': 1 if widget['widget'] == 'output' else 0,
                        'id': widget['id'],
                        'virtual': widget['virtual'],
                        'port': widget['port'],
                        'last_value': widget['last_value'],
                        }

                    if flag:
                        board_tasks[int(id)] = widget_
                    else:
                        board_tasks.append(widget_)

                    board.tasks = json.dumps(board_tasks)
                    board.save()

        user.widgets_json = json.dumps(widgets)
        user.save()

    return HttpResponse('ok')


def get_user_ip(request: HttpRequest):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')

    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]

    else:
        ip = request.META.get('REMOTE_ADDR')

    return ip
