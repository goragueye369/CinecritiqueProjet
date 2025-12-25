"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenRefreshView

# Vue d'accueil personnalisée
def home_view(request):
    return JsonResponse({
        'message': 'Bienvenue sur l\'API de CineCritique',
        'endpoints': {
            'login': '/api/login/',
            'refresh_token': '/api/token/refresh/',
            'register': '/api/register/',
            'profile': '/api/profile/',
            'users': '/api/users/',
            'admin': '/admin/'
        },
        'documentation': 'Pour plus d\'informations, consultez la documentation de l\'API.'
    })

def api_home_view(request):
    return JsonResponse({
        'message': 'Bienvenue sur l\'API de CineCritique',
        'endpoints': {
            'login': '/api/login/',
            'refresh_token': '/api/token/refresh/',
            'register': '/api/register/',
            'profile': '/api/profile/',
            'users': '/api/users/'
        },
        'documentation': 'Pour plus d\'informations, consultez la documentation de l\'API.'
    })

urlpatterns = [
    # Page d'accueil de l'API
    path('', home_view, name='home'),
    
    # Interface d'administration
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include([
        path('', api_home_view, name='api_home'),
        path('', include('users.urls')),
        path('reviews/', include('reviews.urls')),
    ])),
    
    # Endpoint de rafraîchissement du token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Servir les fichiers media
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
