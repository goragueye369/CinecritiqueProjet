from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.urls import reverse
from django.conf import settings

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'bio']
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return attrs
    
    def create(self, validated_data):
        # Remove password2 from validated_data
        validated_data.pop('password2')
        
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            bio=validated_data.get('bio', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio', 'profile_picture', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class ProfileUpdateSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = ['username', 'bio', 'profile_picture']
        
    def validate_username(self, value):
        user = self.context['request'].user
        if User.objects.exclude(id=user.id).filter(username=value).exists():
            raise serializers.ValidationError("Ce pseudo est déjà utilisé.")
        return value
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Convertir l'URL relative en URL complète
        if data.get('profile_picture'):
            if not data['profile_picture'].startswith('http'):
                request = self.context.get('request')
                if request:
                    # Forcer HTTPS et corriger le protocole
                    data['profile_picture'] = f"https://{request.get_host()}{data['profile_picture']}"
        return data

class UserListSerializer(serializers.ModelSerializer):
    reviews_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'bio', 'profile_picture', 'date_joined', 'reviews_count']
        read_only_fields = fields
    
    def get_reviews_count(self, obj):
        # Compter le nombre de critiques de l'utilisateur
        from reviews.models import Review
        return Review.objects.filter(author=obj).count()