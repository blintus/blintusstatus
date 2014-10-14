from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta

def formatDatetime(datetime):
	datetime += timedelta(hours=-4)
	return datetime.strftime("%m/%d/%Y at %H:%M")


class Category(models.Model):
	"""Contains a category and parent category"""

	class Meta:
		verbose_name_plural = "Categories"
	
	def __str__(self):
		if (self.parent):
			return self.name + " :: " + self.parent.name
		else:
			return self.name

	def serialize(self):
		return {
			"pk": self.pk,
			"name": self.name,
			"parent": self.parent.pk if self.parent else None,
			"status": self.status
		}

	name = models.CharField(max_length=20)
	parent = models.ForeignKey("Category", null = True, blank = True)
	status = models.PositiveIntegerField()


class Post(models.Model):
	"""Stores status posts"""

	def __str__(self):
		return str(self.created) + " :: " + str(self.user) + " :: " + self.message

	def serialize(self):
		return {
			"pk": self.pk,
			"title": self.title,
			"status": self.status,
			"category": self.category.pk,
			"created": formatDatetime(self.created),
			"updated": formatDatetime(self.updated),
			"message": self.message,
			"user": self.user.username
		}

	title = models.CharField(max_length=255)
	status = models.PositiveIntegerField()
	category = models.ForeignKey(Category)
	created = models.DateTimeField(auto_now = False, auto_now_add = True)
	updated = models.DateTimeField(auto_now = True)
	message = models.TextField()
	user = models.ForeignKey(User)


class Comment(models.Model):
	"""Stores comment posts"""

	def __str__(self):
		return str(self.created) + " :: " + str(self.user) + " :: " + self.message

	def serialize(self):
		return {
			"pk": self.pk,
			"post": self.post.pk,
			"created": formatDatetime(self.created),
			"updated": formatDatetime(self.updated),
			"message": self.message,
			"user": self.user.username
		}

	post = models.ForeignKey(Post)
	created = models.DateTimeField(auto_now = False, auto_now_add = True)
	updated = models.DateTimeField(auto_now = True)
	message = models.TextField()
	user = models.ForeignKey(User)


class Provider(models.Model):
	"""Maps phone provider to email for that provider"""

	def __str__(self):
		return self.name + " :: " + self.gateway

	def serialize(self):
		return {
			"pk": self.pk,
			"name": self.name,
			"gateway": self.gateway
		}

	name = models.CharField(max_length=25)
	gateway = models.CharField(max_length=30)


class ContactMethod(models.Model):
	"""Many to 1 :: ContactMethods -> User"""

	def __str__(self):
		if (self.email):
			return str(self.user) + " :: " + self.email

		elif (self.phoneNumber and self.provider.name):
			return str(self.user) + " :: " + self.phoneNumber + " :: " + self.provider.name

	def serialize(self):
		return {
			"pk": self.pk,
			"email": self.email if self.email else None,
			"phoneNumber": self.phoneNumber if self.phoneNumber else None,
			"provider": self.provider.name if self.provider else None,
			"user": self.user.username
		}


	email = models.CharField(max_length=35, null = True, blank = True)
	phoneNumber = models.CharField(max_length=15, null = True, blank = True)
	provider = models.ForeignKey(Provider, null = True, blank = True)
	user = models.ForeignKey(User)


class Subscription(models.Model):
	"""Allows users to subscribe to categories"""

	def __str__(self):
		if (self.contactMethod.email):
			return str(self.user) + " :: " + self.category.name + " :: " + self.contactMethod.email

		elif (self.contactMethod.phoneNumber and self.contactMethod.provider.name):
			return str(self.user) + " :: " + self.category.name + " :: " + self.contactMethod.phoneNumber + " :: " + self.contactMethod.provider.name

	def serialize(self):
		return {
			"pk": self.pk,
			"category": self.category.pk,
			"user": self.user.username,
			"contactMethod": self.contactMethod.pk
		}

	category = models.ForeignKey(Category)
	user = models.ForeignKey(User)
	contactMethod = models.ForeignKey(ContactMethod)
