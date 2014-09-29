from django.contrib import admin

# Register your models here.

from status.models import *
admin.site.register(Category)
admin.site.register(Comment)
admin.site.register(Provider)
admin.site.register(ContactMethod)
admin.site.register(Subscription)

class StatusAdmin(admin.ModelAdmin):
    fields = ('title', 'category', 'status', 'user', 'message')

admin.site.register(Post, StatusAdmin)