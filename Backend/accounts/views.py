from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework.generics import GenericAPIView
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import login, logout
from rest_framework.views import APIView
from .serializers import SignUpSerializer, ProfileSerializer, UserSerializer, LoginSerializer
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from .models import Profile
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken, TokenError
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import ValidationError
import logging

# Set up logger
logger = logging.getLogger(__name__)


class SignUpView(GenericAPIView):
    serializer_class = SignUpSerializer
    permission_classes = [AllowAny]

    def post(self, request: Request):
        try:
            data = request.data
            serializer = SignUpSerializer(data=data)
            
            if serializer.is_valid():
                serializer.save()
                response = {
                    'message': 'User Created Successfully',
                    'data': serializer.data
                }
                return Response(data=response, status=status.HTTP_201_CREATED)
            
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Signup error: {str(e)}")
            return Response({
                'error': 'An error occurred during signup',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request: Request):
        try:
            serializer = LoginSerializer(data=request.data)
            
            if not serializer.is_valid():
                return Response({
                    'error': 'Invalid credentials',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = serializer.validated_data
            
            # Check if user is active
            if not user.is_active:
                return Response({
                    'error': 'Account is disabled'
                }, status=status.HTTP_403_FORBIDDEN)
            
            refresh = RefreshToken.for_user(user)

            # Create response
            response = Response({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            }, status=status.HTTP_200_OK)

            # Set HttpOnly cookies for tokens
            response.set_cookie(
                key='access_token',
                value=str(refresh.access_token),
                httponly=True,
                secure=settings.DEBUG is False,
                samesite='Strict',
                max_age=60 * 15,  # 15 minutes
                path='/'
            )

            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                secure=settings.DEBUG is False,
                samesite='Strict',
                max_age=60 * 60 * 24 * 7,  # 7 days
                path='/'
            )

            return response

        except ValidationError as e:
            return Response({
                'error': 'Validation error',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response({
                'error': 'An error occurred during login',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request):
        try:
            # Optionally blacklist the refresh token
            refresh_token = request.COOKIES.get('refresh_token')
            
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                except TokenError:
                    pass  # Token already invalid or blacklisted
            
            response = Response({
                "message": "Logout successful"
            }, status=status.HTTP_200_OK)

            # Delete the cookies
            response.delete_cookie('access_token', path='/')
            response.delete_cookie('refresh_token', path='/')

            logout(request)
            return response
        
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            # Still return success and clear cookies even if blacklisting fails
            response = Response({
                "message": "Logout successful"
            }, status=status.HTTP_200_OK)
            response.delete_cookie('access_token', path='/')
            response.delete_cookie('refresh_token', path='/')
            return response


class RefreshTokenView(APIView):
    """View to refresh access token using refresh token from cookie"""
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request: Request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            if not refresh_token:
                return Response({
                    'error': 'Refresh token not found',
                    'message': 'Please login again'
                }, status=status.HTTP_401_UNAUTHORIZED)

            try:
                refresh = RefreshToken(refresh_token)
                
                # Create new access token
                response = Response({
                    'message': 'Token refreshed successfully'
                }, status=status.HTTP_200_OK)

                response.set_cookie(
                    key='access_token',
                    value=str(refresh.access_token),
                    httponly=True,
                    secure=settings.DEBUG is False,
                    samesite='Strict',
                    max_age=60 * 15,  # 15 minutes
                    path='/'
                )

                return response

            except TokenError as e:
                logger.warning(f"Invalid refresh token: {str(e)}")
                return Response({
                    'error': 'Invalid or expired refresh token',
                    'message': 'Please login again'
                }, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            logger.error(f"Token refresh error: {str(e)}")
            return Response({
                'error': 'An error occurred while refreshing token',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Is_Authenticated(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request: Request):
        try:
            access_token = request.COOKIES.get('access_token')

            if not access_token:
                return Response({"isAuthenticated": False})

            try:
                # Validate the token
                AccessToken(access_token)
                
                # Get user from token
                from rest_framework_simplejwt.authentication import JWTAuthentication
                jwt_auth = JWTAuthentication()
                validated_token = jwt_auth.get_validated_token(access_token)
                user = jwt_auth.get_user(validated_token)

                return Response({
                    "isAuthenticated": True,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    }
                })
            
            except TokenError:
                return Response({"isAuthenticated": False})
            
        except Exception as e:
            logger.error(f"Authentication check error: {str(e)}")
            return Response({"isAuthenticated": False})


class GetUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        try:
            if not request.user.is_authenticated:
                return Response({
                    'error': 'User not authenticated'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            serializer = UserSerializer(instance=request.user, context={'request': request})
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Get user error: {str(e)}")
            return Response({
                'error': 'An error occurred while fetching user data',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateProfile(GenericAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):
        try:
            # Check if profile already exists
            if Profile.objects.filter(user=request.user).exists():
                return Response({
                    'error': 'Profile already exists for this user'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            data = request.data
            serializer = ProfileSerializer(data=data, context={'request': request})
            
            if serializer.is_valid():
                serializer.validated_data['user'] = request.user
                if hasattr(request.user, 'email'):
                    serializer.validated_data['email'] = request.user.email

                serializer.save()
                response = {
                    'message': 'Profile Created',
                    'data': serializer.data
                }
                return Response(data=response, status=status.HTTP_201_CREATED)
            
            return Response({
                'error': 'Invalid profile data',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except ValidationError as e:
            return Response({
                'error': 'Validation error',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Create profile error: {str(e)}")
            return Response({
                'error': 'An error occurred while creating profile',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EditProfile(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request: Request):
        try:
            # Check if profile exists
            try:
                profile = Profile.objects.get(user=request.user)
            except Profile.DoesNotExist:
                return Response({
                    'error': 'Profile not found',
                    'message': 'Please create a profile first'
                }, status=status.HTTP_404_NOT_FOUND)

            data = request.data
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            username = data.get('username')

            # Check if username is taken by another user
            if username and username != request.user.username:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                if User.objects.filter(username=username).exists():
                    return Response({
                        'error': 'Username already taken'
                    }, status=status.HTTP_400_BAD_REQUEST)

            serializer = ProfileSerializer(
                instance=profile,
                data=data,
                partial=True,
                context={'request': request}
            )

            if serializer.is_valid():
                user = request.user
                
                # Update user fields
                if first_name is not None:
                    user.first_name = first_name
                if last_name is not None:
                    user.last_name = last_name
                if username is not None:
                    user.username = username
                
                user.save()
                serializer.save()
                
                return Response({
                    'message': 'Profile updated successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            
            return Response({
                'error': 'Invalid profile data',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response({
                'error': 'Validation error',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Edit profile error: {str(e)}")
            return Response({
                'error': 'An error occurred while updating profile',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ViewProfile(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        try:
            try:
                profile = Profile.objects.get(user=request.user)
                serializer = ProfileSerializer(instance=profile, context={'request': request})
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            
            except Profile.DoesNotExist:
                return Response({
                    'error': 'Profile not found',
                    'message': 'No profile exists for this user',
                    'hasProfile': False
                }, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            logger.error(f"View profile error: {str(e)}")
            return Response({
                'error': 'An error occurred while fetching profile',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)