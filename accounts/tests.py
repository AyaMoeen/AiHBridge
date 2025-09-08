from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from django.utils import timezone
from unittest.mock import patch
import uuid

User = get_user_model()


def create_user(email="test@example.com", password="123456", name="TestUser"):
    return User.objects.create_user(email=email, password=password, name=name)


class AuthViewTests(APITestCase):
    def test_register_user(self):
        url = reverse("accounts:account-register")  
        data = {
            "username": "aya123",
            "name": "Aya Test",
            "email": "aya@gmail.com",
            "password": "123456",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["email"], data["email"])

    def test_logout_user(self):
        user = create_user()
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        url = reverse("accounts:account-logout")
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Successfully logged out")


class PasswordResetTests(APITestCase):
    def setUp(self):
        self.user = create_user(email="ayamoin@gmail.com")

    @patch("accounts.views.send_reset_code_email")
    def test_password_reset_request(self, mock_send_email):
        url = reverse("accounts:account-password-reset")
        response = self.client.post(url, {"email": self.user.email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.reset_code)
        mock_send_email.assert_called_once_with(self.user, self.user.reset_code)

    def test_password_reset_request_invalid_email(self):
        url = reverse("accounts:account-password-reset")
        response = self.client.post(url, {"email": "raghad@gmail.com"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["message"], "If this email exists, a verification code has been sent."
        )

    def test_password_reset_confirm_code_valid(self):
        self.user.reset_code = "123456"
        self.user.reset_code_created_at = timezone.now()
        self.user.save()
        url = reverse("accounts:account-password-reset-confirm-code")
        response = self.client.post(url, {"code": "123456"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("reset_token", response.data)

    def test_password_reset_confirm_code_invalid(self):
        url = reverse("accounts:account-password-reset-confirm-code")
        response = self.client.post(url, {"code": "654321"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Invalid code")

    def test_password_reset_set_new_password_success(self):
        reset_token = str(uuid.uuid4())
        self.user.reset_token = reset_token
        self.user.save()
        url = reverse("accounts:account-password-reset-set-new-password")
        data = {
            "reset_token": reset_token,
            "new_password": "ayapass123",
            "confirm_password": "ayapass123",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Password has been reset successfully.")
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("ayapass123"))

    def test_password_reset_set_new_password_mismatch(self):
        reset_token = str(uuid.uuid4())
        self.user.reset_token = reset_token
        self.user.save()
        url = reverse("accounts:account-password-reset-set-new-password")
        data = {
            "reset_token": reset_token,
            "new_password": "ayapass123",
            "confirm_password": "ayapass124",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Passwords do not match")

    def test_password_reset_set_new_password_invalid_token(self):
        url = reverse("accounts:account-password-reset-set-new-password")
        data = {
            "reset_token": "wrongtoken",
            "new_password": "ayapass123",
            "confirm_password": "ayapass123",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Invalid or expired token")
