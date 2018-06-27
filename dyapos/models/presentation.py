import datetime
import pymongo
import hashlib
from django.db import models
from django.conf import settings
from django.utils.translation import ugettext as _
from bson.objectid import ObjectId


class Presentation(models.Model):
    # Attributes:
    theme = models.ForeignKey("Theme", default=1)
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=500, null=True, blank=True)
    created_date = models.DateTimeField(auto_now=True)
    key = models.CharField(max_length=30)
    edit_key = models.CharField(null=True, max_length=50)
    is_private = models.BooleanField(default=False)
    has_progressbar = models.BooleanField(default=True)
    slides_timeout = models.IntegerField(default=0)
    num_views = models.IntegerField(default=0)
    num_likes = models.IntegerField(default=0)

    class Meta:
        app_label = "dyapos"

    def like(self):
        """Increases the number of likes by one on the presentation"""
        self.num_likes += 1
        self.save()

    def increase_num_views(self):
        """Increases the number of views by one on the presentation"""
        # NOTE: I don't know how to do it, because it increases every time I
        # refresh the page with F5
        pass

    def get_associated_users(self):
        """Return the users that are associated with this presentation
        Returns:
                list: list of associated users
        """
        users = [
            userpresentation.user for userpresentation in self.userpresentation_set.get_queryset()]
        return users

    def delete_completely(self):
        """Deletes the presentation completely including slides, and relation with other users"""
        # connect to MongoDB
        conn = pymongo.Connection(settings.MONGODB_URI)
        db = conn[settings.MONGODB_DATABASE]
        # Remove the slides from MongoDB
        db.slides.remove({"presentation_id": self.id})
        self.delete()

    def clone(self):
        """Clones the presentation and saves it to the database
        Returns:
                instance (Presentation): cloned presentation object
        """
        original_id = self.id
        # delete its PK, so next time the save() method is executed, it'll save a new row to the database with a new ID
        self.id = None
        # generate a presentation key, based on a random SHA1 string
        self.key = hashlib.sha1(str(datetime.datetime.now())).hexdigest()[:10]
        # generate a new name to the presentation
        self.name = _("Copy of") + " " + self.name
        # set the number of views and likes to 0
        self.num_views = self.num_likes = 0
        # save the new copied presentation to the database
        self.save()
        # Copy slides from MongoDB database
        conn = pymongo.Connection(settings.MONGODB_URI)
        db = conn[settings.MONGODB_DATABASE]
        slides = db.slides.find({"presentation_id": int(original_id)})
        for i in slides:
            # Replace the slide _id and its presentation_id
            i["_id"] = ObjectId()
            i["presentation_id"] = self.id
            # Replace the components' _id
            for j in i["components"]:
                j["_id"] = str(ObjectId())
            # Finally save the new slide
            db.slides.insert(i)
        return self

    def get_slides(self):
        """Get the presentation slides
        Returns:
                pymongo Cursor: list of slides
        """
        # Load slides from MongoDB
        conn = pymongo.Connection(settings.MONGODB_URI)
        db = conn[settings.MONGODB_DATABASE]
        slides = db.slides.find({"presentation_id": self.id}).sort("number", 1)
        return slides

    def generate_edit_key(self):
        """Generates an edit key which will be used to invite other users to edit the presentation
        Returns:
                str: the generated key
        """
        self.edit_key = hashlib.sha1(
            str(datetime.datetime.now())).hexdigest()[:15]
        self.save()
        return self.edit_key
