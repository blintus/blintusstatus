from django.contrib import admin

# Register your models here.

from status.models import *


def updateCategoryStatuses(category, status):
        category.status = status
        category.save()
        if category.parent == None:
            return
        if status == 2:
            updateCategoryStatuses(category.parent, 2)
        else:
            siblingCategories = Category.objects.filter(parent = category.parent)
            siblingsMatch = True
            for sibling in siblingCategories:
                if sibling.status != status:
                    siblingsMatch = False
                    break
            if siblingsMatch:
                updateCategoryStatuses(category.parent, status)
            else:
                updateCategoryStatuses(category.parent, 2)


class CategoryAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        updateCategoryStatuses(obj, obj.status)


class PostAdmin(admin.ModelAdmin):
    fields = ('title', 'category', 'status', 'user', 'message')

    def save_model(self, request, obj, form, change):
        updateCategoryStatuses(obj.category, obj.status)
        obj.save();


admin.site.register(Category, CategoryAdmin)
admin.site.register(Comment)
admin.site.register(Provider)
admin.site.register(ContactMethod)
admin.site.register(Subscription)
admin.site.register(Post, PostAdmin)