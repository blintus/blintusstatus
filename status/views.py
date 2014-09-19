import json

from django.shortcuts import render, redirect, HttpResponse

from django.contrib.auth import authenticate, login as djangoLogin, logout as djangoLogout
from django.contrib.auth.models import User


def index(request):
    return HttpResponse(json.dumps(["testObject"]), content_type="application/json")


def register(request):
    error = False
    username = ""
    if request.POST:
        username = request.POST["username"]
        password = request.POST["password"]
        confirmPassword = request.POST["confirmPassword"]
        
        if username and password and confirmPassword:
            if ((User.objects.filter(username=username).count()) == 1):
                error = "User already exists"
            else:
                user = User.objects.create_user(username=username, password=password)
                user.backend = "django.contrib.auth.backends.ModelBackend"
                djangoLogin(request, user)
                if "next" in request.GET:
                    return redirect(request.GET["next"])
                else:
                    return redirect("status:root")
        else:
            error = "Error registering. Please fill out all fields and click Register."
    return render(request, "status/register.html", {
        "page_title": "Register Account",
        "error": error,
        "username": username
    })


def login(request):
    error = False
    username = ""
    if request.POST:
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(username = username, password = password)
        if user and user.is_active:
            djangoLogin(request, user)
            if "next" in request.GET:
                return redirect(request.GET["next"])
            else:
                return redirect("status:root")
        else:
            error = "Error signing in. Please enter a valid username and password and click Sign In."
    return render(request, "status/login.html", {
        "page_title": "Login",
        "error": error,
        "username": username
    })


def logout(request):
    djangoLogout(request)
    if "next" in request.GET:
        return redirect(request.GET["next"])
    else:
        return redirect("status:root")
