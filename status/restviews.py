import json

from django.shortcuts import HttpResponse
from status.decorators import rest_login_required
from django.core import serializers
from status.models import Category


def _returnJSON(obj):
    return HttpResponse(json.dumps(obj), content_type="application/json")


def index(request):
    return _returnJSON(["testObject"])


@rest_login_required
def status(request, id = None):
	if request.method == 'GET':
		return _returnJSON(["status"])


@rest_login_required
def comment(request, id = None):
	if request.method == 'GET':
		return _returnJSON(["comment"])
	elif request.method == 'POST':
		pass


@rest_login_required
def provider(request, id = None):
	if request.method == 'GET':
		return _returnJSON(["provider"])


@rest_login_required
def contactMethod(request, user_id = None):
	if request.method == 'GET':
		return _returnJSON(["contactMethod"])
	elif request.method == 'POST':
		pass
	elif request.method == 'DELETE':
		pass


@rest_login_required
def category(request):
	if request.method == 'GET':
		return HttpResponse(serializers.serialize("json", Category.objects.all()), content_type="application/json")


@rest_login_required
def subscriptions(request, user_id = None):
	if request.method == 'GET':
		return _returnJSON(["subscriptions"])
	elif request.method == 'POST':
		pass
	elif request.method == 'DELETE':
		return _returnJSON(["ZOMG THIS JUST GOT DELETED"])
