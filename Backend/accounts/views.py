from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework.generics import GenericAPIView
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import login,logout
from rest_framework.views import APIView
from .serializers import SignUpSerializer,ProfileSerializer,UserSerializer,LoginSerializer
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from .models import Profile
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken



class SignUpView(GenericAPIView):
    serializer_class = SignUpSerializer

    def post(self,request:Request):
        data = request.data
        serializer = SignUpSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            response = {
                'message':'User Created Successfully',
                'data': serializer.data
            }
            return Response(data=response,status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView): 
    permission_classes = [AllowAny]
    def post(self, request:Request): 
        serializer = LoginSerializer(data=request.data) 
        if serializer.is_valid(): 
            user = serializer.validated_data 
            refresh = RefreshToken.for_user(user)
            
            
            return Response({ 'refresh': str(refresh), 'access': str(refresh.access_token), },status=status.HTTP_200_OK) 
            # return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    


class LogoutView(APIView):
    
    def post(self,request:Request):
        logout(request)
        return Response({"logout":"Successful"},status=status.HTTP_200_OK)


class Is_Authenticated(APIView):
    def get(self,request:Request):
        if request.user.is_authenticated:
            return Response({"isAuthenticated":True})
        else:
            return Response({"isAuthenticated":False})
    
class GetUserView(APIView):
    def get(self,request:Request):
        serializer = UserSerializer(instance=request.user,context={'request':request})
        return Response(data=serializer.data)


class CreateProfile(GenericAPIView):
    serializer_class= ProfileSerializer
    def post(self,request:Request):
        data = request.data
        serializer = ProfileSerializer(data=data,context={'request':request})
        if serializer.is_valid():
            serializer.validated_data['user'] = request.user
            serializer.validated_data['email'] = request.user.email
            
            serializer.save()
            response = {
                'message':'Profile Created',
                'data': serializer.data
            }
            return Response(data=response,status=status.HTTP_201_CREATED)  
        return Response(data=serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        

class EditProfile(APIView):
    def put(self, request:Request) :
        profile = Profile.objects.get(user=request.user)    
        data=request.data
        serializer = ProfileSerializer(instance=profile,data=data,partial=True,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data,status=status.HTTP_200_OK)    
        return Response(data=serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class ViewProfile(GenericAPIView):
    def get(self, request:Request):
        
        
        try:
            profile = Profile.objects.get(user=request.user)
            serializer = ProfileSerializer(instance=profile,context={'request':request})
            return Response(data=serializer.data,status=status.HTTP_200_OK)        
        except Profile.DoesNotExist:
            return Response(data=False)
# Create your views here.
