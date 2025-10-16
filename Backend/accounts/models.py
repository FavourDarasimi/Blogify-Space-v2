from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
user = settings.AUTH_USER_MODEL



class User(AbstractUser):
    first_name = models.CharField(max_length=10)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=255,unique=True)
    

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username",]

    def __str__(self) -> str:
        return self.username
    

class Profile(models.Model):
    user = models.OneToOneField(user,on_delete=models.CASCADE,null=True,blank=True,related_name='profile')
    bio = models.TextField(max_length=500)
    image = models.ImageField( blank=True,upload_to='images/')  
     

    def __str__(self) -> str:
        return str(self.user.username)

# Create your models here.
