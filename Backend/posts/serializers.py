import random
from rest_framework import serializers
from .models import Category,Post,Comment,SavedPost
from accounts.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    num_of_posts =serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields = ['id', 'name','description','num_of_posts']

    def get_num_of_posts(self,obj):
        post = Post.objects.filter(category=obj)
        return post.count()    


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True) 
    likes = serializers.SlugRelatedField(many=True,slug_field='username',read_only=True)
    category = serializers.SlugRelatedField(slug_field='name',queryset=Category.objects.all())
    time_since_created = serializers.SerializerMethodField() 
    user_liked = serializers.SerializerMethodField()
    user_saved = serializers.SerializerMethodField()
    image = serializers.ImageField(use_url=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ['id','user','title','category','body','image','likes','saved','featured','top','user_liked','date_added','time_since_created',"likes_count","comments_count","user_saved"]
        read_only_fields= ['user','saved']

    def get_time_since_created(self,obj):
        return obj.time_since_created()
    
    def get_likes_count(self,obj):
        return obj.likes.count()
    
    def get_comments_count(self,obj):
        return obj.comments.count()
    
    def get_user_liked(self,obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user in obj.likes.all()
        return False
    def get_user_saved(self,obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user in obj.saved.all()
        return False
        

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    post = serializers.StringRelatedField()
    time_since_created = serializers.SerializerMethodField() 
    class Meta:
        model = Comment
        fields = ['id','user','post','comment','date_added','time_since_created']
        read_only_fields= ['user']

    def get_time_since_created(self,obj):
        return obj.time_since_created()    
    

class SavedPostSerializer(serializers.ModelSerializer):    
    post = PostSerializer()
    class Meta:
        model = SavedPost
        fields = ['id','user','post']
    