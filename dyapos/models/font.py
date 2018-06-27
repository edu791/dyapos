from django.db import models


class Font(models.Model):
    name = models.CharField(max_length=50)
    filename = models.FileField(upload_to="fonts")

    class Meta:
        app_label = "dyapos"

    def __str__(self):
        return self.name

    def natural_key(self):
        return self.name
