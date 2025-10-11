from django.db import models
from django.conf import settings
from django.utils import timezone
import math
User = settings.AUTH_USER_MODEL

class Category(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=100)

    def __str__(self) :
        return self.name

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,blank=True,null=True)
    title = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE,null=True)
    body = models.TextField(max_length=10000)
    image = models.ImageField(blank=True,null=True,upload_to='images/')
    likes = models.ManyToManyField(User, related_name='likes', blank=True)
    saved = models.ManyToManyField(User, related_name='saved', blank=True)
    top = models.BooleanField(default=False,blank=True,null=True)
    featured = models.BooleanField(default=False,blank=True,null=True)
    date_added = models.DateTimeField(auto_now_add=True,blank=True,null=True)
    def __str__(self)  :
        return self.title
    
    def time_since_created(self):
        now=timezone.now()
        diff = now - self.date_added
        if diff.days ==0 and diff.seconds <60:
            return f'{diff.seconds} seconds ago'
        elif diff.days == 0 and diff.seconds<3600:
            minutes = math.floor(diff.seconds/60)
            return f'{minutes} minutes ago'
        elif diff.days == 0:
            hours = math.floor(diff.seconds/3600)
            if hours==1:
                return f'{hours} hour ago'
            else:
                return f'{hours} hours ago'
            
        elif diff.days < 30:
            if diff.days == 1:
                return f'{diff.days} day ago'
            else:
                return f'{diff.days} days ago'
        elif diff.days < 365:
            month = math.floor(diff.days/30)
            return  f'{month} months ago'
        else:
            years = math.floor(diff.days/365)
            return f'{years} years ago'


class Comment(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,blank=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE,related_name="comments")
    comment = models.TextField(max_length=500)
    date_added = models.DateTimeField(auto_now_add=True,blank=True)
    def __str__(self) :
        return f'{self.user}-{self.post}'
    
    def time_since_created(self):
        now=timezone.now()
        diff = now - self.date_added
        if diff.days ==0 and diff.seconds <60:
            return f'{diff.seconds} seconds ago'
        elif diff.days == 0 and diff.seconds<3600:
            minutes = math.floor(diff.seconds/60)
            if minutes == 1:
                return f'{minutes} minute ago'
            else:     
                return f'{minutes} minutes ago'
        elif diff.days == 0:
            hours = math.floor(diff.seconds/3600)
            if hours<2:
                return f'{hours} hour ago'
            else:
                return f'{hours} hours ago'
        elif diff.days < 30:
            if diff.days ==1:
                return f'{diff.days} day ago'
            else:
                return f'{diff.days} days ago'
        elif diff.days < 365:
            month = math.floor(diff.days/30)
            return  f'{month} months ago'
        else:
            years = math.floor(diff.days/365)
            return f'{years} years ago'



class SavedPost(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user} - {self.post}'            
# Create your models here.
