from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class FollowAPITestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(email="user1@gmail.com", password="123456")
        self.user2 = User.objects.create_user(email="user2@gmail.com", password="123456")
        self.client.force_authenticate(user=self.user1)

    def test_follow_user(self):
        url = reverse("follows:follow-follow", kwargs={"pk": self.user2.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["following"], self.user2.pk)

    def test_cannot_follow_self(self):
        url = reverse("follows:follow-follow", kwargs={"pk": self.user1.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_follow_twice_returns_200(self):
        url = reverse("follows:follow-follow", kwargs={"pk": self.user2.pk})
        self.client.post(url) 
        response = self.client.post(url)  
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unfollow_user(self):
        follow_url = reverse("follows:follow-follow", kwargs={"pk": self.user2.pk})
        self.client.post(follow_url)
        unfollow_url = reverse("follows:follow-unfollow", kwargs={"pk": self.user2.pk})
        response = self.client.delete(unfollow_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unfollow_nonexistent_relation(self):
        unfollow_url = reverse("follows:follow-unfollow", kwargs={"pk": self.user2.pk})
        response = self.client.delete(unfollow_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_followers(self):
        self.client.force_authenticate(user=self.user2)
        self.client.post(reverse("follows:follow-follow", kwargs={"pk": self.user1.pk}))

        self.client.force_authenticate(user=self.user1)
        url = reverse("follows:follow-followers", kwargs={"pk": self.user1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["follower"], self.user2.pk)

    def test_list_following(self):
        self.client.post(reverse("follows:follow-follow", kwargs={"pk": self.user2.pk}))
        url = reverse("follows:follow-following", kwargs={"pk": self.user1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["following"], self.user2.pk)
