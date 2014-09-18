from django.shortcuts import render, redirect, HttpResponse

from django.contrib.auth import authenticate, login as djangoLogin, logout as djangoLogout
from django.contrib.auth.models import User

# Create your views here.

def index(request):
    return HttpResponse("Hi.")


def login(request):
    error = False
    if request.POST:
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(username = username, password = password)
        if user and user.is_active:
            djangoLogin(request, user)
            return redirect("status:root")
        else:
            error = True
    return render(request, "status/login.html", {
        "page_title": "Login",
        "error": error,
        "username": username
    })


def logout(request):
    djangoLogout(request)
    return redirect("status:root")
