from pathlib import Path
import os
BASE_DIR = Path(__file__).resolve().parent.parent 
SECRET_KEY = 'dev-key-change-later' 
DEBUG = False 
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'cinecritiqueprojet.onrender.com', 'cinecritique-projet-nu.vercel.app'] 
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'api',
    'users',
    'reviews'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Configuration des gestionnaires d'exceptions personnalisés
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

# Configuration CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # URL du frontend Vite
    "http://127.0.0.1:5173",
    "http://localhost:5174",  # Port alternatif
    "http://127.0.0.1:5174",
    "http://localhost:5175",  # Port actuel
    "http://127.0.0.1:5175",
    "https://cinecritiqueprojet.onrender.com",
    "https://cinecritique-projet-nu.vercel.app"
]

CORS_ALLOW_CREDENTIALS = True

# Autoriser les en-têtes personnalisés
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Autoriser les méthodes HTTP
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Configuration des gestionnaires d'exceptions personnalisés
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'EXCEPTION_HANDLER': 'users.exceptions.custom_exception_handler',
}

# Configuration JWT
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}
ROOT_URLCONF = 'config.urls' 
# Configuration de la base de données PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'cinecritique_db',
        'USER': 'cinecritique_db_user',
        'PASSWORD': 'sw3I1kLAyElsk6eXtTEwimpkK0kG0st1',
        'HOST': 'dpg-d5654vbuibrs739e0gc0-a.oregon-postgres.render.com',
        'PORT': '5432',
    }
} 
LANGUAGE_CODE = 'fr-fr' 
TIME_ZONE = 'Europe/Paris' 
USE_I18N = True 
USE_TZ = True 
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files (uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Configuration pour la production
if not DEBUG:
    # En production, utiliser un service externe pour les fichiers media
    # Pour Render.com, les fichiers media sont servis via l'URL de l'application
    try:
        import dj_database_url
        database_url = os.environ.get('DATABASE_URL')
        if database_url and database_url.strip():
            DATABASES = {
                'default': dj_database_url.parse(database_url)
            }
        else:
            # Utiliser la configuration par défaut si DATABASE_URL est vide
            pass
    except ImportError:
        # Fallback si dj_database_url n'est pas disponible
        pass

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'   
AUTH_USER_MODEL = 'users.CustomUser'
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages'
            ]
        }
    },
] 
