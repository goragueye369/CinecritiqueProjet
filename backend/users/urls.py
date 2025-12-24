from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LogoutView,
    UserProfileView,
    CustomTokenObtainPairView,
    UserListView,
    UserDetailView
)

urlpatterns = [
    # Authentification
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Profil utilisateur
    path('profile/', UserProfileView.as_view(), name='profile'),
    
    # Gestion des utilisateurs
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    
    # Note: L'endpoint /api/token/refresh/ est défini dans config/urls.py
]