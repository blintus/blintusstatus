import json

from django.shortcuts import HttpResponse
from status.decorators import rest_login_required
from django.core import serializers
from status.models import Status, Comment, Provider, ContactMethod, Category, Subscription


def _returnJSON(obj):
    return HttpResponse(serializers.serialize("json", obj), content_type="application/json")


def index(request):
    return _returnJSON(["testObject"])


@rest_login_required
def status(request, status_id = None):
	if request.method == 'GET':
		if status_id:
			return _returnJSON(Status.objects.filter(id = status_id))
		return _returnJSON(Status.objects.all())


@rest_login_required
def comment(request, status_id = None):
	if request.method == 'GET':
		if status_id:
			thisStatus = Status.objects.filter(id = status_id)
			return _returnJSON(Comment.objects.filter(status = thisStatus))
	elif request.method == 'POST':
		pass


@rest_login_required
def provider(request, provider_id = None):
	if request.method == 'GET':
		if provider_id:
			return _returnJSON(Provider.objects.filter(id = provider_id))
		return _returnJSON(Provider.objects.all())


@rest_login_required
def contactMethod(request, user_id = None):
	if request.method == 'GET':
		if user_id:
			thisUser = user.objects.filter(id = user_id)
			return _returnJSON(ContactMethod.objects.filter(user = thisUser))
	elif request.method == 'POST':
		pass
	elif request.method == 'DELETE':
		pass


@rest_login_required
def category(request):
	if request.method == 'GET':
		return _returnJSON(Category.objects.all())


@rest_login_required
def subscription(request, user_id = None):
	if request.method == 'GET':
		if user_id:
			thisUser = user.objects.filter(id = user_id)
			return _returnJSON(Subscription.objects.filter(user = thisUser))
	elif request.method == 'POST':
		pass
	elif request.method == 'DELETE':
		return _returnJSON(["ZOMG THIS JUST GOT DELETED"])
