from django.contrib.auth.models import check_password
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthBackend(object):
	def authenticate(self, username=None, password=None):
		""" Authenticate with username or email"""
		if '@' in username:
			kwargs = {'email': username}
		else:
			kwargs = {'username': username}
		try:
			user = User.objects.get(**kwargs)
			if user.check_password(password):
				return user
		except User.DoesNotExist:
			return None

	def get_user(self, user_id):
		""" Get a User object from the user_id. """
		try:
			return User.objects.get(pk=user_id)
		except User.DoesNotExist:
			return None