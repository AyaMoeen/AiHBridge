from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image

def create_user(email="user@example.com", password="123456", name="Test User"):
    return User.objects.create_user(email=email, password=password, name=name)

class ProfileViewSetTest(APITestCase):
    def setUp(self):
        self.user = create_user(email="aya@gmail.com", name="Aya")
        self.user2 = create_user(email="Raghad@gmail.com", name="Raghad")
        self.url_list = reverse("profiles:profile-list")
        self.url_update = reverse("profiles:profile-update-profile")

    def test_list_profile_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user_id"], self.user.id)

    def test_list_profile_unauthenticated(self):
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_profile_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {"bio": "New bio"}
        response = self.client.patch(self.url_update, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.profile.refresh_from_db()
        self.assertEqual(self.user.profile.bio, "New bio")

    def test_update_profile_authenticated_with_picture(self):
        self.client.force_authenticate(user=self.user)
        # Create a dummy image
        img = BytesIO()
        image = Image.new('RGB', (100, 100))
        image.save(img, format='PNG')
        img.seek(0)

        uploaded_file = SimpleUploadedFile("test.png", img.read(), content_type="image/png")
        data = {"bio": "Bio with picture", "profile_picture": uploaded_file}
        response = self.client.patch(self.url_update, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.profile.refresh_from_db()
        self.assertEqual(self.user.profile.bio, "Bio with picture")
        self.assertTrue(bool(self.user.profile.profile_picture))

    def test_update_profile_unauthenticated(self):
        data = {"bio": "Hack bio"}
        response = self.client.patch(self.url_update, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
