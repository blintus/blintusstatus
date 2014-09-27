import json

from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotAllowed
from status.decorators import rest_login_required
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
	
	return HttpResponseNotAllowed({'message':'method provided is not supported'})


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
		user = request.POST['user']
		if status and message and user:
			comment = Comment(status = status, message = message, user = user)
			comment.save()
			return _returnJSON(comment)
		else:
			return HttpResponseBadRequest({'message':'Please supply the associated status, a message, and the user posting'})
	
	return HttpResponseNotAllowed({'message':'method provided is not supported'})


@rest_login_required
def provider(request, provider_id = None):
	if request.method == 'GET':
		if provider_id:
			return _returnJSON(Provider.objects.filter(id = provider_id))
		return _returnJSON(Provider.objects.all())
	
	return HttpResponseNotAllowed({'message':'method provided is not supported'})


@rest_login_required
def contactMethod(request, user_id = None):
	if request.method == 'GET':
		if user_id:
			thisUser = user.objects.filter(id = user_id)
			return _returnJSON(ContactMethod.objects.filter(user = thisUser))
		else:
			return HttpResponseBadRequest({'message':'Please provide a user'})
		
	email = request.POST['email']
	phoneNumber = request.POST['phoneNumber']
	provider = request.POST['provider']
	user = request.POST['user']
	
	if not (user and email or (phoneNumber and provider)):
		return HttpResponseBadRequest({'message':'Please supply either an email or phone number with provider'})
	
	if request.method == 'POST':
		contactMethod = ContactMethod(email = email, phoneNumber = phoneNumber, provider = provider, user = user)
		contactMethod.save()
		return _returnJSON(contactMethod)
		
	elif request.method == 'DELETE':
		ContactMethod.objects.filter(email = email, phoneNumber = phoneNumber, provider = provider, user = user).delete()
		return HttpResponse({'message':'Contact methods successfully deleted'})
	
	return HttpResponseNotAllowed({'message':'method provided is not supported'})


@rest_login_required
def category(request):
	if request.method == 'GET':
		return _returnJSON(Category.objects.all())
	return HttpResponseNotAllowed({'message':'method provided is not supported'})


@rest_login_required
def subscription(request, user_id = None):
	if request.method == 'GET':
		if user_id:
			thisUser = user.objects.filter(id = user_id)
			return _returnJSON(Subscription.objects.filter(user = thisUser))
		return HttpResponseBadRequest({'message':'Please supply the user id'})

	category = request.POST['category']
	user = request.POST['user']
	contactMethod = request.POST['contactMethod']
	
	if not (category and user and contactMethod):
		return HttpResponseBadRequest({'message':'Please supply a category, user, and contact method'})
	
	if request.method == 'POST':	
			subscription = Subscription(category = category, user = user, contactMethod = contactMethod)
			subscription.save()
			return _returnJSON(subscription)

	elif request.method == 'DELETE':
		Subscription.objects.filter(category = category, user = user, contactMethod = contactMethod).delete()
		return HttpResponse({'message':'Subscription successfully deleted'})
	
	return HttpResponseNotAllowed({'message':'method provided is not supported'})
