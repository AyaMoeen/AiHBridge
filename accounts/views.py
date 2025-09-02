from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from .utils import (
    generate_code, generate_reset_token, send_reset_code_email,
    get_user_by_email, get_user_by_reset_code, get_user_by_reset_token, is_reset_code_expired
)

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = get_user_by_email(response.data['email'])
        token, _ = Token.objects.get_or_create(user=user)
        response.data['token'] = token.key
        return response


class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)


class PasswordResetAPIView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_user_by_email(email)
        if not user:
            return Response({"message": "If this email exists, a verification code has been sent."})

        code = generate_code()
        user.reset_code = code
        user.reset_code_created_at = timezone.now()
        user.save()
        send_reset_code_email(user, code)

        return Response({"message": "Verification code sent to your email."})


class PasswordResetConfirmCodeAPIView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get("code")
        if not code:
            return Response({"error": "Code is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_user_by_reset_code(code)
        if not user:
            return Response({"error": "Invalid code"}, status=status.HTTP_400_BAD_REQUEST)

        if is_reset_code_expired(user):
            return Response({"error": "Code has expired"}, status=status.HTTP_400_BAD_REQUEST)
        
        reset_token = generate_reset_token()
        user.reset_token = reset_token
        user.save()

        return Response({
            "message": "Code verified successfully. Use this token to reset your password.",
            "reset_token": reset_token
        })


class PasswordResetSetNewPasswordAPIView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        reset_token = request.data.get("reset_token")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not reset_token or not new_password or not confirm_password:
            return Response(
                {"error": "reset_token, new_password, and confirm_password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_user_by_reset_token(reset_token)
        if not user:
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.reset_code = None
        user.reset_token = None
        user.reset_code_created_at = None
        user.save()

        return Response({"message": "Password has been reset successfully."})
