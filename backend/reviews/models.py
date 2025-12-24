from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Review(models.Model):
    """
    Modèle pour les critiques de films
    """
    title = models.CharField(max_length=200, verbose_name="Titre du film")
    content = models.TextField(verbose_name="Contenu de la critique")
    rating = models.IntegerField(
        choices=[(i, i) for i in range(1, 6)],  # Notes de 1 à 5
        verbose_name="Note"
    )
    author = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='reviews',
        verbose_name="Auteur"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        verbose_name = "Critique"
        verbose_name_plural = "Critiques"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.author.username} ({self.rating}/5)"
