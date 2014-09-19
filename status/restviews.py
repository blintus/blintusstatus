import json

from django.shortcuts import HttpResponse

def _returnJSON(obj):
    return HttpResponse(json.dumps(obj), content_type="application/json")


def index(request):
    return _returnJSON(["testObject"])