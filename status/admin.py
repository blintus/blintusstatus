from django.contrib import admin

# Register your models here.

from status.models import *
admin.site.register(Category)
admin.site.register(Post)
admin.site.register(Status)
admin.site.register(Comment)
admin.site.register(Provider)
admin.site.register(ContactMethod)
