from django.http import JsonResponse, HttpResponseForbidden

def rest_login_required(func):
	def wrapper(request, *args, **kwargs):
		if request.user.is_authenticated():
			return func(request, *args, **kwargs)
		else:
			return HttpResponseForbidden(JsonResponse({'message':'login required'}))
	return wrapper