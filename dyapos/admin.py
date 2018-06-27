from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from dyapos.models.theme import Theme
from dyapos.models.presentation import Presentation
from dyapos.models.font import Font
from django.contrib.auth import get_user_model

User = get_user_model()

# Register your models here.
admin.site.register(Theme)
admin.site.register(Presentation)
admin.site.register(Font)


class MyUserAdmin(UserAdmin):
    model = User
    fieldsets = UserAdmin.fieldsets + ((None, {'fields': ('info',)}),)

admin.site.register(User, MyUserAdmin)
