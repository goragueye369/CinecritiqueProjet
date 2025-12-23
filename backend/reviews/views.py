from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q, Avg
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
    Vue pour obtenir des statistiques sur les critiques
    """
    try:
        total_reviews = Review.objects.count()
        avg_rating = Review.objects.aggregate(avg_rating=Avg('rating'))['avg_rating']
        
        return Response({
            'total_reviews': total_reviews,
            'average_rating': round(avg_rating, 1) if avg_rating else 0,
            'rating_distribution': {
                '5_stars': Review.objects.filter(rating=5).count(),
                '4_stars': Review.objects.filter(rating=4).count(),
                '3_stars': Review.objects.filter(rating=3).count(),
                '2_stars': Review.objects.filter(rating=2).count(),
                '1_star': Review.objects.filter(rating=1).count(),
            }
        })
    except Exception as e:
        return Response(
            {'error': 'Erreur lors de la récupération des statistiques'},
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
