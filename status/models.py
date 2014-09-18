from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
	"""Contains a category and parent category"""
	
	def __str__(self):
		if (self.parent):
			return self.name + " :: " + self.parent.name
		else:
			return self.name

	name = models.CharField(max_length=20)
	parent = models.ForeignKey("Category", null = True, blank = True)


class Post(models.Model):
	"""Generic post object used by Status and Comment"""
	
	class Meta:
		abstract = True

	def __str__(self):
		return self.created + " :: " + self.user + " :: " + self.message

	created = models.DateField(auto_now = False, auto_now_add = True)
	updated = models.DateField(auto_now = True)
	message = models.TextField()
	user = models.ForeignKey(User)


class Status(Post):
	"""Stores status posts"""

	status = models.PositiveIntegerField()
	category = models.ForeignKey(Category)


class Comment(Post):
	"""Stores comment posts"""

	status = models.ForeignKey(Status)
