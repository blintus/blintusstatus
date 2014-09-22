import json

from django.shortcuts import HttpResponse
from status.decorators import rest_login_required


def _returnJSON(obj):
    return HttpResponse(json.dumps(obj), content_type="application/json")


def index(request):
    return _returnJSON(["testObject"])


@rest_login_required
def status(request):
	if request.method == 'GET':
		return _returnJSON(["status"])


@rest_login_required
def comment(request):
	if request.method == 'GET':
		return _returnJSON(["comment"])
	elif request.method == 'POST':
		pass


@rest_login_required
def provider(request):
	if request.method == 'GET':
		return _returnJSON(["provider"])


@rest_login_required
def contactMethod(request):
	if request.method == 'GET':
		return _returnJSON(["contactMethod"])
	elif request.method == 'POST':
		pass


@rest_login_required
def category(request):
	if request.method == 'GET':
		return _returnJSON(["category"])


@rest_login_required
def subscriptions(request):
	if request.method == 'GET':
		return _returnJSON(["subscriptions"])
	elif request.method == 'POST':
		pass
