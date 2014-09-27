from django.core.serializers import json

class JSONSerializer(json.Serializer):

	def get_dump_object(self, obj):
		d = self._current
		d['pk'] = obj.id
		return d

