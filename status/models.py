from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
	"""Contains a category and parent category"""

	class Meta:
		verbose_name_plural = "Categories"
	
	def __str__(self):
		if (self.parent):
			return self.name + " :: " + self.parent.name
		else:
			return self.name

	name = models.CharField(max_length=20)
	parent = models.ForeignKey("Category", null = True, blank = True)
	status = models.PositiveIntegerField()


class Post(models.Model):
	"""Stores status posts"""

	def __str__(self):
		return str(self.created) + " :: " + str(self.user) + " :: " + self.message

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

	post = models.ForeignKey(Post)
	created = models.DateField(auto_now = False, auto_now_add = True)
	updated = models.DateField(auto_now = True)
	message = models.TextField()
	user = models.ForeignKey(User)


class Provider(models.Model):
	"""Maps phone provider to email for that provider"""

	def __str__(self):
		return self.name + " :: " + self.gateway

	name = models.CharField(max_length=25)
	gateway = models.CharField(max_length=30)


class ContactMethod(models.Model):
	"""Many to 1 :: ContactMethods -> User"""

	def __str__(self):
		if (self.email):
			return str(self.user) + " :: " + self.email

		elif (self.phoneNumber and self.provider.name):
			return str(self.user) + " :: " + self.phoneNumber + " :: " + self.provider.name


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

	category = models.ForeignKey(Category)
	user = models.ForeignKey(User)
	contactMethod = models.ForeignKey(ContactMethod)
