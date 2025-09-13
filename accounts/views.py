from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer
from .utils import (
    generate_code, generate_reset_token, send_reset_code_email,
    get_user_by_email, get_user_by_reset_code, get_user_by_reset_token, is_reset_code_expired
)

User = get_user_model()


class AccountViewSet(viewsets.ViewSet):
    """
    A ViewSet for handling user registration, login/logout, and password reset.
    """
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        from django.contrib.auth import authenticate
        email = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})


    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        data = serializer.data
        data['token'] = token.key
        return Response(data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def logout(self, request):
        request.user.auth_token.delete()
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def password_reset(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_user_by_email(email)
        if user:
            code = generate_code()
            user.reset_code = code
            user.reset_code_created_at = timezone.now()
            user.save()
            send_reset_code_email(user, code)

        return Response({"message": "If this email exists, a verification code has been sent."})

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def password_reset_confirm_code(self, request):
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

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def password_reset_set_new_password(self, request):
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
