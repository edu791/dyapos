from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.paginator import Paginator
from hashlib import md5
from dyapos.models.userpresentation import UserPresentation
from django.conf import settings

NUM_PRESENTATIONS_PER_PAGE = 10


class User(AbstractUser):
    info = models.TextField(max_length=250, null=True, blank=True)
    reset_password_key = models.CharField(max_length=50, null=True)

    class Meta:
        app_label = "dyapos"

    def get_email_hash(self):
        return md5(self.email).hexdigest()

    def get_all_presentations(self, page_number, search=""):
        presentations = map(lambda uspr: uspr.presentation, self.userpresentation_set.filter(
            presentation__name__contains=search))
        return Paginator(presentations, NUM_PRESENTATIONS_PER_PAGE).page(page_number)

    def get_own_presentations(self, page_number, search="", hide_private=False):
        if hide_private:
            presentations = map(lambda uspr: uspr.presentation, self.userpresentation_set.filter(
                is_owner=True, presentation__name__contains=search, presentation__is_private=False))
        else:
            presentations = map(lambda uspr: uspr.presentation, self.userpresentation_set.filter(
                is_owner=True, presentation__name__contains=search))
        return Paginator(presentations, NUM_PRESENTATIONS_PER_PAGE).page(page_number)

    def get_shared_presentations(self, page_number, search=""):
        presentations = map(lambda uspr: uspr.presentation, self.userpresentation_set.filter(
            is_owner=False, presentation__name__contains=search))
        return Paginator(presentations, NUM_PRESENTATIONS_PER_PAGE).page(page_number)

    def associate_to_presentation(self, presentation, is_owner, can_edit):
        """Associates a user to a presentation
        Args:
                presentation (Presentation): the presentation to associate
                is_owner (bool): True if the user is owner of the presentation, otherwise False
                can_edit (bool): True if the user can edit the presentation, otherwise False
        """
        userpresentation = UserPresentation(user=self,
                                            presentation=presentation,
                                            is_owner=is_owner,
                                            can_edit=can_edit)
        userpresentation.save()

    def is_allowed(self, presentation):
        """Check if the user can access to the presentation"""
        if self.userpresentation_set.filter(presentation=presentation).exists():
            return True
        else:
            return False

    def is_owner(self, presentation):
        """Checks if the user is owner of the presentation
        Args:
                presentation (Presentation): the presentation to check
        Returns:
                bool: True if owner or False otherwise
        """
        if self.is_allowed(presentation):
            userpresentation = self.userpresentation_set.filter(
                presentation=presentation).first()
            if userpresentation.is_owner:
                return True
            else:
                return False
        else:
            return False

    def can_edit(self, presentation):
        """Checks if the user can edit the presentation
        Args:
                presentation (Presentation): the presentation to check
        Returns:
                bool: True if can edit or False otherwise
        """
        if self.is_allowed(presentation):
            userpresentation = self.userpresentation_set.filter(
                presentation=presentation).first()
            if userpresentation.can_edit:
                return True
            else:
                return False
        else:
            return False

    def presentation_limit_reached(self):
        """Check if the user has reached the maximum presentation limit
        Returns:
                Boolean
        """
        return True if self.userpresentation_set.filter(is_owner=True).count() < settings.PRESENTATIONS_NUMBER_LIMIT else False
