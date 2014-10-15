from django.http import JsonResponse, HttpResponseForbidden, HttpResponseNotAllowed
from types import FunctionType

def rest_login_required(*blockedMethods):
    def wrapper(func):
    	def inner_wrapper(request, *args, **kwargs):
    		if request.user.is_authenticated() or request.method not in blockedMethods:
    			return func(request, *args, **kwargs)
    		else:
    			return HttpResponseForbidden(JsonResponse({'message':'login required'}))
    	return inner_wrapper
    if len(blockedMethods) == 1 and type(blockedMethods[0]) == FunctionType:
        return wrapper(blockedMethods[0])
    return wrapper

def allowed_methods(*allowedMethods):
    def wrapper(func):
        def inner_wrapper(request, *args, **kwargs):
            if request.method not in allowedMethods:
                return HttpResponseNotAllowed(allowedMethods, JsonResponse({'message':'method provided is not supported'}))
            return func(request, *args, **kwargs)
        return inner_wrapper
    return wrapper