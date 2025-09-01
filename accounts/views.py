from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from rest_framework import status

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(email=response.data['email'])
        token, created = Token.objects.get_or_create(user=user)
        response.data['token'] = token.key
        return response

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({"message": "Successfully logged out"}, status=200)
    
# class PasswordResetAPIView(generics.GenericAPIView):
#     permission_classes = [AllowAny]
#     def post(self, request):
#         email = request.data.get('email')
#         if not email:
#             return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             return Response({"message": "If this email exists, a reset link has been sent."})

#         uid = urlsafe_base64_encode(force_bytes(user.pk))
#         token = default_token_generator.make_token(user)
#         reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"  

#         send_mail(
#             subject="Password Reset",
#             message=f"Use this link to reset your password: {reset_link}",
#             from_email=None,
#             recipient_list=[user.email],
#         )

#         return Response({"message": "Password reset link sent."})
    
# class PasswordResetConfirmAPIView(generics.GenericAPIView):
#     permission_classes = [AllowAny]
#     def post(self, request):
#         uid = request.data.get("uid")
#         token = request.data.get("token")
#         new_password = request.data.get("new_password")

#         if not uid or not token or not new_password:
#             return Response({"error": "UID, token, and new_password are required"},
#                             status=status.HTTP_400_BAD_REQUEST)

#         try:
#             uid = force_str(urlsafe_base64_decode(uid))
#             user = User.objects.get(pk=uid)
#         except (User.DoesNotExist, ValueError, TypeError):
#             return Response({"error": "Invalid UID"}, status=status.HTTP_400_BAD_REQUEST)

#         if not default_token_generator.check_token(user, token):
#             return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

#         user.set_password(new_password)
#         user.save()
#         return Response({"message": "Password has been reset successfully."})
