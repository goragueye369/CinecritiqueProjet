from reviews.models import Review
from users.models import CustomUser

# Récupérer un utilisateur existant
user = CustomUser.objects.first()
if user:
    print(f'Utilisateur trouvé: {user.email}')
    
    # Créer une critique pour Inception
    review1, created = Review.objects.get_or_create(
        title='Inception',
        author=user,
        defaults={
            'content': 'Un film extraordinaire avec des concepts fascinants sur les rêves. La direction de Christopher Nolan est brillante et les effets visuels sont stupéfiants.',
            'rating': 5
        }
    )
    print(f'Critique Inception: {"créée" if created else "existait déjà"}')
    
    # Créer une critique pour The Dark Knight
    review2, created = Review.objects.get_or_create(
        title='The Dark Knight',
        author=user,
        defaults={
            'content': 'Le Joker de Heath Ledger est absolument inoubliable. Un film d\'action sombre et intelligent qui redéfinit le genre super-héros.',
            'rating': 5
        }
    )
    print(f'Critique The Dark Knight: {"créée" if created else "existait déjà"}')
    
    # Afficher toutes les critiques
    print('\nToutes les critiques:')
    for review in Review.objects.all():
        print(f'- {review.title} par {review.author.username}: {review.rating}/5')
else:
    print('Aucun utilisateur trouvé')
