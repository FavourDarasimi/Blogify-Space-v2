from rest_framework import serializers
from .models import User,Profile
from django.contrib.auth import authenticate
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token


class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email', 'password','gender' ,'first_name','last_name']

    def create(self,validated_data):
        password = validated_data['password']
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user    
    

class LoginSerializer(serializers.Serializer): 
    username = serializers.CharField() 
    password = serializers.CharField() 
    def validate(self, data): 
        user = authenticate(username=data['username'], password=data['password']) 
        if user and user.is_active: 
            return user 
        raise serializers.ValidationError("Invalid credentials")

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email','username','first_name','last_name']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True) 
    class Meta:
        model = Profile
        fields = ['id','user','bio','image']
        read_only_fields = ['user']

    