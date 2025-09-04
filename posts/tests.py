from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from .models import Post, Category


def create_user(email="user@example.com", password="123456", name="Test User"):
    return User.objects.create_user(email=email, password=password, name=name)


def create_category(name="Tech"):
    return Category.objects.create(name=name)


def create_post(user, title="Test Post", description="Description", personal_review="Review", categories=None):
    if categories is None:
        categories = []
    post = Post.objects.create(
        user=user,
        title=title,
        description=description,
        personal_review=personal_review
    )
    post.categories.set(categories)
    return post


class PostAPITestSetup(APITestCase):
    def setUp(self):
        self.user = create_user(email="aya@gmail.com", name="Aya")
        self.user2 = create_user(email="Raghad@gmail.com", name="Raghad")
        self.category1 = create_category("Tech")
        self.category2 = create_category("Health")
        self.post = create_post(
            user=self.user,
            title="My First Post",
            categories=[self.category1, self.category2]
        )


class PostListCreateTest(PostAPITestSetup):
    def test_list_posts(self):
        url = reverse("posts:post-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], self.post.title)

    def test_create_post_authenticated(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("posts:post-list")
        data = {
            "title": "New Post",
            "description": "Some description",
            "personal_review": "My review",
            "category_ids": [self.category1.id, self.category2.id],
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], data["title"])
        self.assertEqual(len(response.data["categories"]), 2)

    def test_create_post_unauthenticated(self):
        url = reverse("posts:post-list")
        data = {
            "title": "New Post",
            "description": "Some description",
            "personal_review": "My review",
            "category_ids": [self.category1.id],
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PostDetailTest(PostAPITestSetup):
    def test_retrieve_post(self):
        url = reverse("posts:post-detail", args=[self.post.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.post.title)

    def test_update_post_authenticated_owner(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("posts:post-detail", args=[self.post.id])
        data = {
            "title": "Updated Post",
            "description": "Updated description",
            "personal_review": "Updated review",
            "category_ids": [self.category1.id],
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.post.refresh_from_db()
        self.assertEqual(self.post.title, "Updated Post")
        self.assertEqual(self.post.categories.count(), 1)

    def test_update_post_authenticated_not_owner(self):
        self.client.force_authenticate(user=self.user2)
        url = reverse("posts:post-detail", args=[self.post.id])
        data = {
            "title": "Hack Post",
            "description": self.post.description,
            "personal_review": self.post.personal_review,
            "category_ids": [c.id for c in self.post.categories.all()],
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.post.refresh_from_db()
        self.assertEqual(self.post.title, "Hack Post") 

    def test_delete_post_authenticated_owner(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("posts:post-detail", args=[self.post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Post.objects.filter(id=self.post.id).exists())

    def test_delete_post_unauthenticated(self):
        url = reverse("posts:post-detail", args=[self.post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue(Post.objects.filter(id=self.post.id).exists())
