from django.conf import settings
from django.conf.urls import patterns, url
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = patterns('status',

    # 404
    url(r'^404', 'views.notFound', name='notFound'),

    # rest urls
    url(r'^rest/posts(/(?P<post_id>\d+))?', 'restviews.post', name='post'),
    url(r'^rest/comments', 'restviews.comment', name='comment'),
    url(r'^rest/providers(/(?P<provider_id>\d+))?', 'restviews.provider', name='provider'),
    url(r'^rest/contactMethods', 'restviews.contactMethod', name='contactMethod'),
    url(r'^rest/categories', 'restviews.category', name='category'),
    url(r'^rest/subscriptions', 'restviews.subscription', name='subscription'),

    # login/logout/register views
    url(r'^login', 'views.login', name='login'),
    url(r'^logout', 'views.logout', name='logout'),
    url(r'^register', 'views.register', name='register'),

    # every other page view
    url(r'^', TemplateView.as_view(template_name='status/page.html'), name='root')
    
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
