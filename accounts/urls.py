from django.urls import path
from django.views.generic import TemplateView
from rest_framework.authtoken.views import obtain_auth_token
from . import views

app_name = "accounts"

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', obtain_auth_token, name='api_token_auth'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    
    path('password_reset/', views.PasswordResetAPIView.as_view(), name='password_reset'),
    path('password_reset_confirm_code/', views.PasswordResetConfirmCodeAPIView.as_view(), name='password_reset_confirm_code'),
    path('password_reset_set_new_password/', views.PasswordResetSetNewPasswordAPIView.as_view(), name='password_reset_set_new_password'),
]


