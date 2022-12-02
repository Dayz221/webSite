from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse
from .models import Users


def page(request: HttpRequest):
    return render(request, 'users/page.html')


def login(request: HttpRequest):
    if request.method == 'POST':
        name = request.POST.get('username')
        password = request.POST.get('password')
        ip = get_user_ip(request)

        if Users.objects.filter(username=name).count() == 0:
            return HttpResponse('login or password is incorrect')
        
        else:
            user = Users.objects.get(username=name)
            user_password = user.userpassword
            # user_last_ip = user.lastip

            if user_password == password:
                delete_all_lastip(ip)
                user.lastip = ip
                user.save()
                return HttpResponse('ok')

            else:
                return HttpResponse('login or password is incorrect')


def logout(request):
    ip = get_user_ip(request)
    if Users.objects.filter(lastip=ip).count() > 0:
        user = Users.objects.get(lastip=ip)
        user.lastip = ''
        user.save()

    return redirect('/')


def register(request: HttpRequest):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        ip = get_user_ip(request)

        if Users.objects.filter(username=username).count() != 0:
            return HttpResponse('this name is already registered')

        else:
            delete_all_lastip(ip)
            Users.objects.create(username=username, userpassword=password, lastip=ip, widgets_json="[]", attached_boards="[]", current_board = "0")
            return HttpResponse('ok')


def delete_all_lastip(ip: str):
    users = Users.objects.filter(lastip=ip)

    for user in users:
        user.lastip = ''
        user.save()


def get_user_ip(request: HttpRequest):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    
    else:
        ip = request.META.get('REMOTE_ADDR')
    
    return ip
