from django.db import models
from django.conf import settings


class Theme(models.Model):
    name = models.CharField(max_length=45)
    is_custom = models.BooleanField(default=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True)
    image_preview = models.ImageField(upload_to="themes/image_previews", blank=True)
    custom_logo = models.ImageField(upload_to="themes/custom_logos", null=True, blank=True)
    background_color = models.CharField(max_length=15, default="#d7d7d7")
    title_font = models.ForeignKey("Font", null=True, blank=True, related_name="title_set")
    title_color = models.CharField(max_length=15, default="#000000")
    subtitle_font = models.ForeignKey("Font", null=True, blank=True, related_name="subtitle_set")
    subtitle_color = models.CharField(max_length=15, default="#000000")
    body_font = models.ForeignKey("Font", null=True, blank=True, related_name="body_set")
    body_color = models.CharField(max_length=15, default="#000000")
    extra_css_code = models.TextField(null=True, blank=True)

    class Meta:
        app_label = "dyapos"

    def __str__(self):
        return self.name
