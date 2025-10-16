from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions

class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom authentication class that reads JWT from HttpOnly cookies
    """
    def authenticate(self, request):
        # Get token from cookie instead of header
        raw_token = request.COOKIES.get('access_token')
        
        if raw_token is None:
            return None
        
        # Validate the token
        validated_token = self.get_validated_token(raw_token)
        
        # Return user and token
        return self.get_user(validated_token), validated_token