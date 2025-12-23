from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les critiques de films
    """
    author_username = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 
            'title', 
            'content', 
            'rating', 
            'author', 
            'author_username',
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'author', 'author_username', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Assigner l'auteur automatiquement à l'utilisateur connecté
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

class ReviewListSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour la liste des critiques (moins de détails)
    """
    author_username = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 
            'title', 
            'content',
            'rating', 
            'author_username',
            'created_at'
        ]