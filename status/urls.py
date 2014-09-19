from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = patterns('status',

    # rest urls
    url(r'^rest', 'restviews.index', name='rest'),

    # login/logout/register views
    url(r'^login', 'views.login', name='login'),
    url(r'^logout', 'views.logout', name='logout'),
    url(r'^register', 'views.register', name='register'),

    # every other page view
    url(r'^', TemplateView.as_view(template_name='status/page.html'), name='root')
    
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
