from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/doc', include('django.contrib.admindocs.urls')),
    url(r'^admin', include(admin.site.urls)),
    #Users
    url(r'^signup','dyapos.views.users.signup', name="signup"),
    url(r'^login','django.contrib.auth.views.login', {"template_name": "login.html"}, name="login"),
    url(r'^logout','django.contrib.auth.views.logout',{"next_page": "/"} , name="logout"),
    url(r'^user/(?P<username>[a-z@.+-_]+)$','dyapos.views.users.user', name="user"),
    url(r'^settings', 'dyapos.views.users.user_settings', name="settings"),
    url(r'^update-profile', 'dyapos.views.users.update_profile', name="update-profile"),
    url(r'^change-password','dyapos.views.users.change_password', name="password-change"),
    url(r'^recover-password','dyapos.views.users.recover_password', name="password-recover"),
    url(r'^reset-password/(?P<key>\w+)','dyapos.views.users.reset_password', name="password-reset"),
    url(r'^delete-account','dyapos.views.users.delete', name="account-delete"),
    # Presentations
    url(r'^create', 'dyapos.views.presentations.create', name="create"),
    url(r'^delete/(?P<id>\w+)', 'dyapos.views.presentations.delete', name="delete"),
    url(r'^copy/(?P<id>\w+)', 'dyapos.views.presentations.copy', name="copy"),
    url(r'^rename/(?P<id>\d+)', 'dyapos.views.presentations.rename', name="rename"),
    url(r'^modify-description/(?P<id>\d+)', 'dyapos.views.presentations.modify_description', name="description-modify"),
    url(r'^edit/(?P<key>\w+)$', 'dyapos.views.presentations.edit', name="edit"),
    url(r'^presentation/change-options/(?P<id>\d+)$', 'dyapos.views.presentations.change_options', name="presentation-change-options"),
    url(r'^presentation/download/(?P<id>\d+)$', 'dyapos.views.presentations.download', name="download"),
    url(r'^p/(?P<key>\w+)','dyapos.views.presentations.presentation', name="presentation"),
    url(r'^view/(?P<key>\w+)$', 'dyapos.views.presentations.view', name="view"),
    url(r'^share/(?P<id>\d+)', 'dyapos.views.presentations.share', name="share"),
    url(r'^get-edit-link/(?P<id>\w+)', 'dyapos.views.presentations.get_edit_link', name="get-edit-link"),
    url(r'^join/(?P<key>\w+)/(?P<edit_key>\w+)$', 'dyapos.views.presentations.join', name="join"),
    url(r'^unshare/(?P<id>\d+)', 'dyapos.views.presentations.unshare', name="unshare"),
    url(r'^load-featured$', 'dyapos.views.presentations.load_featured', name="featured"),
    url(r'^like/(?P<id>\w+)', 'dyapos.views.presentations.like', name="like"),
    # Pages
    url(r'^$','dyapos.views.pages.index'),
    url(r'^index','dyapos.views.pages.index', name="index"),
    url(r'^home$','dyapos.views.pages.home', name="home"),
    url(r'^home\?filter=own$','dyapos.views.pages.home', name="home-own"),
    url(r'^home\?filter=shared$','dyapos.views.pages.home', name="home-shared"),
    url(r'^home/first-time$','dyapos.views.pages.home', {"first_time": True}),
    url(r'^demo$', 'dyapos.views.pages.demo', name="demo"),
    # Themes
    url(r'^theme/get-list$', 'dyapos.views.themes.get_list', name="themes"),
    url(r'^theme/get_css/(?P<id>\d+)$', 'dyapos.views.themes.get_css', name="theme-css"),
    url(r'^theme/set$', 'dyapos.views.themes.set', name="theme-set"),
    url(r'^theme/edit/(?P<id>\d+)$', 'dyapos.views.themes.edit', name="theme-edit"),
    url(r'^theme/delete/(?P<id>\d+)$', 'dyapos.views.themes.delete_theme', name="theme-delete"),
    # Configs
    url(r'^lang/(?P<lang>\w+)','dyapos.views.configs.change_language', name="lang"),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
)

