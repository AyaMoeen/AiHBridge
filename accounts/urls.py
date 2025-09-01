from django.urls import path
from django.views.generic import TemplateView
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from django.contrib.auth import views as auth_views
from . import views
from django.views.decorators.csrf import csrf_exempt

app_name = "accounts"

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', obtain_auth_token, name='api_token_auth'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    
    
    # path('password_reset/', views.PasswordResetAPIView.as_view(), name='password_reset'),
    # path('password_reset_confirm/', views.PasswordResetConfirmAPIView.as_view(), name='password_reset_confirm'),
    
]
# path('password_reset/', csrf_exempt(auth_views.PasswordResetView.as_view()), name='password_reset'),
# path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
# path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
# path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
# DRF password reset endpoints