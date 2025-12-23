from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q, Avg, Count
from django.db import models
from .models import Review
from .serializers import ReviewSerializer, ReviewListSerializer

class ReviewListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister et créer des critiques
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReviewSerializer
        return ReviewListSerializer
    
    def get_queryset(self):
        # Récupérer les critiques, avec possibilité de filtrer
        queryset = Review.objects.all().order_by('-created_at')
        
        # Filtrer par auteur si spécifié
        author_id = self.request.query_params.get('author_id')
        if author_id:
            queryset = queryset.filter(author_id=author_id)
        
        # Filtrer par titre si spécifié
        title_search = self.request.query_params.get('search')
        if title_search:
            queryset = queryset.filter(title__icontains=title_search)
        
        return queryset
    
    def perform_create(self, serializer):
        # L'auteur est automatiquement assigné dans le sérialiseur
        serializer.save()

class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour voir, modifier et supprimer une critique spécifique
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Un utilisateur ne peut voir/modifier que ses propres critiques
        return Review.objects.filter(author=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def review_stats_view(request):
    """
    Vue pour obtenir des statistiques détaillées sur les critiques
    """
    try:
        total_reviews = Review.objects.count()
        avg_rating = Review.objects.aggregate(avg_rating=Avg('rating'))['avg_rating']
        
        # Statistiques par film
        movie_stats = Review.objects.values('title').annotate(
            movie_avg_rating=Avg('rating'),
            movie_review_count=models.Count('id')
        ).order_by('-movie_avg_rating')
        
        # Top films par nombre de critiques
        top_reviewed = Review.objects.values('title').annotate(
            review_count=models.Count('id')
        ).order_by('-review_count')[:5]
        
        # Top films par note moyenne
        top_rated = Review.objects.values('title').annotate(
            avg_rating=Avg('rating'),
            review_count=models.Count('id')
        ).filter(review_count__gte=2).order_by('-avg_rating')[:5]
        
        return Response({
            'total_reviews': total_reviews,
            'average_rating': round(avg_rating, 1) if avg_rating else 0,
            'rating_distribution': {
                '5_stars': Review.objects.filter(rating=5).count(),
                '4_stars': Review.objects.filter(rating=4).count(),
                '3_stars': Review.objects.filter(rating=3).count(),
                '2_stars': Review.objects.filter(rating=2).count(),
                '1_star': Review.objects.filter(rating=1).count(),
            },
            'movie_statistics': {
                'total_movies': movie_stats.count(),
                'top_reviewed': list(top_reviewed),
                'top_rated': list(top_rated)
            }
        })
    except Exception as e:
        return Response(
            {'error': 'Erreur lors de la récupération des statistiques'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def movie_reviews_view(request, movie_title):
    """
    Vue pour récupérer toutes les critiques d'un film spécifique
    """
    try:
        # Normaliser le titre du film pour la recherche insensible à la casse
        normalized_title = movie_title.strip()
        reviews = Review.objects.filter(title__iexact=normalized_title).order_by('-created_at')
        
        if not reviews.exists():
            return Response({
                'message': 'Aucune critique trouvée pour ce film',
                'reviews': []
            }, status=status.HTTP_200_OK)
        
        serializer = ReviewListSerializer(reviews, many=True)
        
        # Calculer les statistiques pour ce film
        avg_rating = reviews.aggregate(avg_rating=Avg('rating'))['avg_rating']
        
        return Response({
            'movie_title': normalized_title,
            'total_reviews': reviews.count(),
            'average_rating': round(avg_rating, 1) if avg_rating else 0,
            'reviews': serializer.data
        })
    except Exception as e:
        return Response(
            {'error': 'Erreur lors de la récupération des critiques du film'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_reviews_view(request):
    """
    Vue pour récupérer uniquement les critiques de l'utilisateur connecté
    """
    try:
        reviews = Review.objects.filter(author=request.user).order_by('-created_at')
        serializer = ReviewListSerializer(reviews, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': 'Erreur lors de la récupération de vos critiques'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
