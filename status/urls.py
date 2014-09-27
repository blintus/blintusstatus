from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = patterns('status',

    # rest urls
    url(r'^rest/status(/(?P<status_id>\d+))?', 'restviews.status', name='status'),
    url(r'^rest/comment(/(?P<status_id>\d+))?', 'restviews.comment', name='comment'),
    url(r'^rest/provider(/(?P<provider_id>\d+))?', 'restviews.provider', name='provider'),
    url(r'^rest/contactMethod/(?P<user_id>\d+)', 'restviews.contactMethod', name='contactMethod'),
    url(r'^rest/category', 'restviews.category', name='category'),
    url(r'^rest/subscription/(?P<user_id>\d+)', 'restviews.subscription', name='subscription'),
    url(r'^rest', 'restviews.index', name='rest'),



    # login/logout/register views
    url(r'^login', 'views.login', name='login'),
    url(r'^logout', 'views.logout', name='logout'),
    url(r'^register', 'views.register', name='register'),

    # every other page view
    url(r'^', TemplateView.as_view(template_name='status/page.html'), name='root')
    
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
