from django.urls import path
from .views import ReviewListCreateView, ReviewDetailView, review_stats_view, my_reviews_view, movie_reviews_view

urlpatterns = [
    # Critiques
    path('', ReviewListCreateView.as_view(), name='review-list-create'),
    path('<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
    
    # Critiques par film
    path('movie/<str:movie_title>/', movie_reviews_view, name='movie-reviews'),
    
    # Mes critiques
    path('my-reviews/', my_reviews_view, name='my-reviews'),
    
    # Statistiques
    path('stats/', review_stats_view, name='review-stats'),
]