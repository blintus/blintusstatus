from django.conf.urls import patterns, include, url

urlpatterns = patterns('status',

    url(r'^$', 'views.index')
)
