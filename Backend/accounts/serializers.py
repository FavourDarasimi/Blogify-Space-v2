from rest_framework import serializers
from .models import User,Profile
from django.contrib.auth import authenticate
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token


class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email', 'password','gender' ]

    def create(self,validated_data):
        password = validated_data['password']
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user    
    

  

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Profile
        fields = ['id','user','bio','image','email','phone_number','location','username']
        read_only_fields = ['user','email','username']

    def get_username(self,obj):
        request = self.context.get('request')
        name = request.user.username
        return name

class LoginSerializer(serializers.Serializer): 
    username = serializers.CharField() 
    password = serializers.CharField() 
    def validate(self, data): 
        user = authenticate(username=data['username'], password=data['password']) 
        if user and user.is_active: 
            return user 
        raise serializers.ValidationError("Invalid credentials")

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = User
        fields = ['id','email','username','profile']
