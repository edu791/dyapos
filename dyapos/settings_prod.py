from settings import *
from os import environ
import dj_database_url

print "Production settings loaded"

ADMINS = (
    ("Admin", environ["ADMIN_EMAIL"]),
)

# Parse database configuration from $DATABASE_URL environment variable
DATABASES['default'] = dj_database_url.config()

MONGODB_URI = environ["MONGODB_URI"]
MONGODB_DATABASE = environ["MONGODB_DATABASE"]

# Node.js configuration
NODEJS_URL = environ["NODEJS_URL"]

# Email configuration
EMAIL_USE_TLS = True
EMAIL_HOST = environ["EMAIL_HOST"]
EMAIL_PORT = environ["EMAIL_PORT"]
EMAIL_HOST_USER = environ["EMAIL_HOST_USER"]
EMAIL_HOST_PASSWORD = environ["EMAIL_HOST_PASSWORD"]
SERVER_EMAIL = environ["ADMIN_EMAIL"]

SECRET_KEY = environ["SECRET_KEY"]

# Setting per user
PRESENTATIONS_NUMBER_LIMIT = 15

DEBUG = False
