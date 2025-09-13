from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()


class NotificationAPITestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username="user1",
            email="user1@example.com",
            password="testpass"
        )
        self.user2 = User.objects.create_user(
            username="user2",
            email="user2@example.com",
            password="testpass"
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)

        self.n1 = Notification.objects.create(
            recipient=self.user1,
            actor=self.user2,
            verb="followed you"
        )
        self.n2 = Notification.objects.create(
            recipient=self.user1,
            actor=self.user2,
            verb="followed you"
        )

    def test_list_notifications(self):
        url = reverse("notifications:notifications-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["recipient"], self.user1.id)

    def test_only_user_notifications_returned(self):
        """User2 should not see User1's notifications"""
        self.client.force_authenticate(user=self.user2)
        url = reverse("notifications:notifications-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_mark_single_notification_as_read(self):
        url = reverse("notifications:notifications-detail", args=[self.n1.pk]) + "mark_read/"
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.n1.refresh_from_db()
        self.assertTrue(self.n1.read)

    def test_mark_nonexistent_notification(self):
        url = reverse("notifications:notifications-detail", args=[9999]) + "mark_read/"
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mark_all_as_read(self):
        url = reverse("notifications:notifications-list") + "mark_all_read/"
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.n1.refresh_from_db()
        self.n2.refresh_from_db()
        self.assertTrue(self.n1.read)
        self.assertTrue(self.n2.read)
