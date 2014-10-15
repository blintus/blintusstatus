import json

from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from status.decorators import rest_login_required, allowed_methods

from status.models import Post, Comment, Provider, ContactMethod, Category, Subscription


def _returnJSON(objs):
	serializedObjs = []
	for obj in objs:
		serializedObjs.append(obj.serialize())
	return HttpResponse(json.dumps(serializedObjs), content_type="text/json")


@allowed_methods('GET')
def post(request, post_id = None):
	if request.method == 'GET':
		if post_id:
			return _returnJSON(Post.objects.filter(id = post_id))
		return _returnJSON(Post.objects.all())


@allowed_methods('GET', 'POST')
@rest_login_required('POST')
def comment(request):
	if request.method == 'GET':
		if 'post' in request.GET:
			return _returnJSON(Comment.objects.filter(post_id = request.GET['post']))
		return _returnJSON(Comment.objects.all())
	
	elif request.method == 'POST':
		postId = request.POST['postId']
		message = request.POST['message']
		if postId and message:
			comment = Comment(post_id = postId, message = message, user = request.user)
			comment.save()
			return HttpResponse(JsonResponse(comment.serialize()))
		else:
			return HttpResponseBadRequest(JsonResponse({'message':'Please supply the associated status and a message'}))


@allowed_methods('GET')
@rest_login_required
def provider(request, provider_id = None):
	if request.method == 'GET':
		if provider_id:
			return _returnJSON(Provider.objects.filter(id = provider_id))
		return _returnJSON(Provider.objects.all())


@allowed_methods('GET', 'POST')
@rest_login_required
def contactMethod(request):
	if request.method == 'GET':
		return _returnJSON(ContactMethod.objects.filter(user = request.user))
		
	subscribed = request.POST['subscribed']
	if not subscribed:
		return HttpResponseBadRequest(JsonResponse({'message':'Please supply subscribed value'}))

	if request.method == 'POST' and subscribed == 'false':
		email = request.POST['email']
		phoneNumber = request.POST['phoneNumber']
		providerid = request.POST['provider']
		
		if not (email or (phoneNumber and providerid)):
			return HttpResponseBadRequest(JsonResponse({'message':'Please supply either an email or phone number with provider'}))
		
		if email:
			provider = None
		else:
			provider = Provider.objects.get(pk=providerid)

		if len(ContactMethod.objects.filter(email = email, phoneNumber = phoneNumber, provider = provider, user = request.user)) > 0:
			return HttpResponseBadRequest(JsonResponse({'contactMethod':'', 'message':'Contact method already exists'}))
		contactMethod = ContactMethod(email = email, phoneNumber = phoneNumber, provider = provider, user = request.user)
		contactMethod.save()
		return JsonResponse({'contactMethod': contactMethod.serialize(), 'message':'Contact method successfully saved'})
		
	elif request.method == 'POST' and subscribed == 'true':
		pk = request.POST['pk']
		if not pk:
			return HttpResponseBadRequest(JsonResponse({'message':'Please supply the pk of a contact method to delete'}))
		
		contactMethod = ContactMethod.objects.get(pk=pk, user = request.user)
		contactMethod.delete()
		contactMethod.pk = pk
		return HttpResponse(JsonResponse({'contactMethod': contactMethod.serialize(), 'message':'Contact method successfully deleted'}))


@allowed_methods('GET')
@rest_login_required
def category(request):
	if request.method == 'GET':
		return _returnJSON(Category.objects.all())


@allowed_methods('GET', 'POST')
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
			return HttpResponse(JsonResponse({'message':'Subscription already exists', 'checked': True}))
		subscription = Subscription(category = category, user = request.user, contactMethod = contactMethod)
		subscription.save()
		return HttpResponse(JsonResponse({'message':'Subscription successfully saved', 'checked': True}))

	elif (request.method == 'POST') and (subscribed == 'true'):
		Subscription.objects.get(category = category, user = request.user, contactMethod = contactMethod).delete()
		return HttpResponse(JsonResponse({'message':'Subscription successfully deleted', 'checked': False}))
