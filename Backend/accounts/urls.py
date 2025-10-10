from . import views
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('token/refresh/',TokenRefreshView.as_view(),name='refresh_token'),
    path('signup/',views.SignUpView.as_view(),name='signup'),
    path('login/',views.LoginView.as_view(),name='login'),
    path('get_user/',views.GetUserView.as_view(),name='get_user'),
    path('is_Authenticated/',views.Is_Authenticated.as_view(),name='is_Authenticated'),
    path('logout/',views.LogoutView.as_view(),name='user'),
    path('profile/create',views.CreateProfile.as_view(),name='create_profile'),
    path('profile',views.ViewProfile.as_view(),name='view_profile'),
    path('profile/edit',views.EditProfile.as_view(),name='edit_profile'),
]