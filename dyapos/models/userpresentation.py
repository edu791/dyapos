from django.db import models
from django.conf import settings


class UserPresentation(models.Model):
    # Attributes:
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    presentation = models.ForeignKey("Presentation")
    is_owner = models.BooleanField()
    can_edit = models.BooleanField()

    class Meta:
        app_label = "dyapos"
    # Methods
