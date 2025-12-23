from django.urls import path
from .views import ReviewListCreateView, ReviewDetailView, review_stats_view, my_reviews_view

urlpatterns = [
    # Critiques
    path('', ReviewListCreateView.as_view(), name='review-list-create'),
    path('<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
    
    # Mes critiques
    path('my-reviews/', my_reviews_view, name='my-reviews'),
    
    # Statistiques
    path('stats/', review_stats_view, name='review-stats'),
]