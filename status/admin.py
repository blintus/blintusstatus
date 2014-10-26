from smtplib import SMTP
from django.contrib import admin
from status.models import *


EMAIL = "status@blint.us"
PASSWORD = "Bl1n+u554+u5"


def updateCategoryStatuses(category, status):
        category.status = status
        category.save()
        if not category.parent:
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


class Emailer(object):
    def __init__(self):
        self.conn = SMTP("smtp.zoho.com", "587")
        self.conn.starttls()
        self.conn.login(EMAIL, PASSWORD)

    def __del__(self):
        self.conn.close()

    def sendEmail(self, to, subject, body):
        message = [
            "To: " + to,
            "From: " + EMAIL,
            "Subject: [Blintus Status] " + subject,
            "",
            body
        ]
        self.conn.sendmail(EMAIL, to, "\n".join(message))


class CategoryAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        updateCategoryStatuses(obj, obj.status)


class PostAdmin(admin.ModelAdmin):
    fields = ('title', 'category', 'status', 'user', 'message')

    def save_model(self, request, obj, form, change):
        updateCategoryStatuses(obj.category, obj.status)
        self.sendNotifications(obj.category, obj, Emailer())
        obj.save();

    def sendNotifications(self, category, post, emailer):
        subscriptions = Subscription.objects.filter(category = category)
        for subscription in subscriptions:
            contactMethod = subscription.contactMethod
            email = ""
            if contactMethod.isEmail():
                email = contactMethod.email
            else:
                email = "{}@{}".format(contactMethod.phoneNumber, contactMethod.provider.gateway)
            emailer.sendEmail(email, post.title, post.message);


admin.site.register(Category, CategoryAdmin)
admin.site.register(Comment)
admin.site.register(Provider)
admin.site.register(ContactMethod)
admin.site.register(Subscription)
admin.site.register(Post, PostAdmin)