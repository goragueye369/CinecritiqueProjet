from django.contrib.auth.models import AbstractUser 
from django.db import models 
import os

def user_profile_picture_path(instance, filename):
    # Le fichier sera téléchargé dans MEDIA_ROOT/user_<id>/<filename>
    return 'profile_pictures/user_{0}/{1}'.format(instance.id, filename)
 
class CustomUser(AbstractUser): 
    email = models.EmailField(unique=True) 
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to=user_profile_picture_path, blank=True, null=True)
    
    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email
