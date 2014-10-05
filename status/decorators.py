from django.http import JsonResponse, HttpResponseForbidden, HttpResponseNotAllowed

def rest_login_required(func):
	def wrapper(request, *args, **kwargs):
		if request.user.is_authenticated():
			return func(request, *args, **kwargs)
		else:
			return HttpResponseForbidden(JsonResponse({'message':'login required'}))
	return wrapper

def allowed_methods(*allowedMethods):
    def wrapper(func):
        def inner_wrapper(request, *args, **kwargs):
            if request.method not in allowedMethods:
                return HttpResponseNotAllowed(allowedMethods, JsonResponse({'message':'method provided is not supported'}))
            return func(request, *args, **kwargs)
        return inner_wrapper
    return wrapper