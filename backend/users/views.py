from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, ProfileUpdateSerializer, UserListSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        try:
            print(f"[DEBUG] Données d'inscription reçues: {request.data}")
            print(f"[DEBUG] Content-Type: {request.content_type}")
            
            serializer = self.get_serializer(data=request.data)
            print(f"[DEBUG] Serializer valide avant validation: {serializer.is_valid()}")
            
            if not serializer.is_valid():
                print(f"[DEBUG] Erreurs de validation: {serializer.errors}")
                return Response({
                    'error': 'Validation failed',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = serializer.save()
            print(f"[DEBUG] Utilisateur créé avec ID: {user.id}")
            print(f"[DEBUG] Email de l'utilisateur: {user.email}")
            print(f"[DEBUG] Mot de passe défini: {'oui' if user.password else 'non'}")
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            response_data = {
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'message': 'Inscription réussie !'
            }
            
            print(f"[DEBUG] Réponse d'inscription: {response_data}")
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"[DEBUG] Exception inattendue dans RegisterView: {str(e)}")
            return Response({
                'error': 'Erreur interne du serveur',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"error": "Le token de rafraîchissement est requis."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({
                "message": "Déconnexion réussie."
            }, status=status.HTTP_205_RESET_CONTENT)
            
        except Exception as e:
            return Response({
                "error": "Token invalide ou expiré."
            }, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'PUT' or self.request.method == 'PATCH':
            return ProfileUpdateSerializer
        return UserSerializer
    
    def get_object(self):
        return self.request.user
    
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            print(f"[DEBUG] Profil utilisateur récupéré: {serializer.data}")
            return Response(serializer.data)
        except Exception as e:
            print(f"[DEBUG] Erreur dans retrieve UserProfileView: {str(e)}")
            return Response({
                'error': 'Erreur lors de la récupération du profil',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Gérer les fichiers multipart
        if request.content_type and 'multipart/form-data' in request.content_type:
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
        else:
            # Pour les requêtes JSON normales
            data = request.data.copy()
            # Supprimer profile_picture si c'est une chaîne vide
            if 'profile_picture' in data and data['profile_picture'] == '':
                data.pop('profile_picture')
            serializer = self.get_serializer(instance, data=data, partial=partial)
        
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(UserSerializer(instance).data)

class UserListView(generics.ListAPIView):
    """
    Vue pour récupérer la liste des utilisateurs
    Exclut l'utilisateur connecté de la liste
    """
    serializer_class = UserListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Récupère tous les utilisateurs sauf l'utilisateur connecté
        return User.objects.exclude(id=self.request.user.id).order_by('username')

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = serializers.EmailField(required=True)
        self.fields['password'] = serializers.CharField(required=True, style={'input_type': 'password'})
        # Remove the username field since we're using email
        self.fields.pop('username', None)

    def validate(self, attrs):
        # Use email for authentication instead of username
        email = attrs.get('email')
        password = attrs.get('password')
        
        print(f"[DEBUG] Tentative de connexion avec email: '{email}' (type: {type(email)})")
        print(f"[DEBUG] Password fourni: {'oui' if password else 'non'}")
        print(f"[DEBUG] Email brut reçu: {repr(email)}")
        
        if not email or not password:
            print("[DEBUG] Email ou mot de passe manquant")
            raise serializers.ValidationError({"detail": "L'email et le mot de passe sont obligatoires."})
        
        # Try to authenticate the user
        user = User.objects.filter(email=email).first()
        
        print(f"[DEBUG] Utilisateur trouvé: {'oui' if user else 'non'}")
        if user:
            print(f"[DEBUG] ID utilisateur: {user.id}")
            print(f"[DEBUG] Mot de passe valide: {'oui' if user.check_password(password) else 'non'}")
            print(f"[DEBUG] Compte actif: {'oui' if user.is_active else 'non'}")
        
        if user and user.check_password(password):
            if not user.is_active:
                print("[DEBUG] Compte désactivé")
                raise serializers.ValidationError({"detail": "Ce compte est désactivé."})
            
            refresh = self.get_token(user)
            
            print(f"[DEBUG] Connexion réussie pour {user.email}")
            
            # Retourner la structure attendue par le frontend
            return {
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                },
                'user': UserSerializer(user).data
            }
        
        print("[DEBUG] Échec de l'authentification")
        raise serializers.ValidationError({"detail": "Identifiants invalides. Veuillez réessayer."})

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        try:
            print(f"[DEBUG] Requête de connexion reçue: {request.data}")
            serializer = self.get_serializer(data=request.data)
            print(f"[DEBUG] Serializer valide: {serializer.is_valid()}")
            
            if not serializer.is_valid():
                print(f"[DEBUG] Erreurs de validation: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            print(f"[DEBUG] Validation réussie, données: {serializer.validated_data}")
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"[DEBUG] Erreur inattendue: {str(e)}")
            return Response({
                "error": "Erreur interne du serveur",
                "detail": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDetailView(generics.RetrieveAPIView):
    """
    Vue pour récupérer les détails d'un utilisateur spécifique
    Accessible publiquement (pas besoin d'authentification)
    """
    serializer_class = UserListSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return User.objects.all()