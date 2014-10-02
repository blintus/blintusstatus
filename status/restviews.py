import json

from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseForbidden
from status.decorators import rest_login_required
from django.contrib.auth.models import User
from status.JSONSerializer import JSONSerializer
from status.models import Post, Comment, Provider, ContactMethod, Category, Subscription


def _returnJSON(obj):
	s = JSONSerializer()
	return HttpResponse(s.serialize(obj), content_type="application/json")


def index(request):
    return _returnJSON(["testObject"])


@rest_login_required
def post(request, post_id = None):
	if request.method == 'GET':
		if post_id:
			return _returnJSON(Post.objects.filter(id = post_id))
		return _returnJSON(Post.objects.all())
	
	return HttpResponseNotAllowed(['GET'], JsonResponse({'message':'method provided is not supported'}))


@rest_login_required
def comment(request, post_id = None):
	if request.method == 'GET':
		if post_id:
			thisPost = Post.objects.filter(id = post_id)
			return _returnJSON(Comment.objects.filter(status = thisPost))
		return _returnJSON(Comment.objects.all())
	
	elif request.method == 'POST':
		status = request.POST['status']
		message = request.POST['message']
		if status and message:
			comment = Comment(status = status, message = message, user = request.user)
			comment.save()
			return HttpResponse(JsonResponse({'message':'Comment successfully saved'}))
		else:
			return HttpResponseBadRequest(JsonResponse({'message':'Please supply the associated status and a message'}))
	
	return HttpResponseNotAllowed(['GET', 'POST'], JsonResponse({'message':'method provided is not supported'}))


@rest_login_required
def provider(request, provider_id = None):
	if request.method == 'GET':
		if provider_id:
			return _returnJSON(Provider.objects.filter(id = provider_id))
		return _returnJSON(Provider.objects.all())
	
	return HttpResponseNotAllowed(['GET'], JsonResponse({'message':'method provided is not supported'}))


@rest_login_required
def contactMethod(request):
	if request.method == 'GET':
		return _returnJSON(ContactMethod.objects.filter(user = request.user))
		
	email = request.POST['email']
	phoneNumber = request.POST['phoneNumber']
	providerid = request.POST['provider']
	subscribed = request.POST['subscribed']
	
	if not (subscribed and (email or (phoneNumber and providerid))):
		return HttpResponseBadRequest(JsonResponse({'message':'Please supply either an email or phone number with provider'}))
	
	if email:
		provider = None
	else:
		provider = Provider.objects.get(pk=providerid)

	if request.method == 'POST' and subscribed == 'false':
		if len(ContactMethod.objects.filter(email = email, phoneNumber = phoneNumber, provider = provider, user = request.user)) > 0:
			return HttpResponse(JsonResponse({'message':'Contact method already exists'}))
		contactMethod = ContactMethod(email = email, phoneNumber = phoneNumber, provider = provider, user = request.user)
		contactMethod.save()
		return HttpResponse(JsonResponse({'message':'Contact method successfully saved'}))
		
	elif request.method == 'POST' and subscribed == 'true':
		ContactMethod.objects.get(email = email, phoneNumber = phoneNumber, provider = provider, user = request.user).delete()
		return HttpResponse(JsonResponse({'message':'Contact methods successfully deleted'}))
	
	return HttpResponseNotAllowed(['GET', 'POST'], JsonResponse({'message':'method provided is not supported'}))


@rest_login_required
def category(request):
	if request.method == 'GET':
		return _returnJSON(Category.objects.all())
	return HttpResponseNotAllowed(['GET'], JsonResponse({'message':'method provided is not supported'}))


@rest_login_required
def subscription(request):
	if request.method == 'GET':
		return _returnJSON(Subscription.objects.filter(user = request.user))

	categoryid = request.POST['categoryid']
	contactMethodid = request.POST['contactmethodid']
	subscribed = request.POST['subscribed']
	
	if not (categoryid and contactMethodid and subscribed):
		return HttpResponseBadRequest(JsonResponse({'message':'Please supply a category, contact method, and a post / delete flag'}))
	
	category = Category.objects.get(pk = categoryid)
	contactMethod = ContactMethod.objects.get(pk = contactMethodid)

	if (request.method == 'POST') and (subscribed == 'false'):
		if len(Subscription.objects.filter(category = category, user = request.user, contactMethod = contactMethod)) > 0:
			return HttpResponse(JsonResponse({'message':'Subscription already exists'}))
		subscription = Subscription(category = category, user = request.user, contactMethod = contactMethod)
		subscription.save()
		return HttpResponse(JsonResponse({'message':'Subscription successfully saved'}))

	elif (request.method == 'POST') and (subscribed == 'true'):
		Subscription.objects.get(category = category, user = request.user, contactMethod = contactMethod).delete()
		return HttpResponse(JsonResponse({'message':'Subscription successfully deleted'}))
	
	return HttpResponseNotAllowed(['GET', 'POST'], JsonResponse({'message':'method provided is not supported'}))
