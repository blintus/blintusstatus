from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

urlpatterns = patterns('status',

    url(r'^rest', 'views.index'),
    url(r'^', TemplateView.as_view(template_name='status/page.html'))
)
