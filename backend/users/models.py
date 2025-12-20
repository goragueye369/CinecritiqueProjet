from django.contrib.auth.models import AbstractUser 
from django.db import models 
 
class CustomUser(AbstractUser): 
    email = models.EmailField(unique=True) 
    bio = models.TextField(blank=True) 
 
    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = ['username'] 
