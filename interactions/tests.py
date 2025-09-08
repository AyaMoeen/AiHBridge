from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from posts.models import Post, Category
from interactions.models import Reaction, Comment, Bookmark, Rating
from django.conf import settings

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
        personal_review=personal_review,
    )
    post.categories.set(categories)
    return post

class InteractionAPITestSetup(APITestCase):
    def setUp(self):
        self.user = create_user(email="aya@gmail.com", name="Aya")
        self.user2 = create_user(email="raghad@gmail.com", name="Raghad")
        self.category = create_category("Tech")
        self.post = create_post(
            user=self.user,
            title="My First Post",
            categories=[self.category],
        )
        self.client.force_authenticate(user=self.user)

class LikeUnlikeTest(InteractionAPITestSetup):
    def test_like_post(self):
        url = reverse("interactions:interaction-like", args=[self.post.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Reaction.objects.filter(user=self.user, post=self.post).exists())

    def test_unlike_post(self):
        Reaction.objects.create(user=self.user, post=self.post)
        url = reverse("interactions:interaction-unlike", args=[self.post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Reaction.objects.filter(user=self.user, post=self.post).exists())

    def test_unlike_without_like(self):
        url = reverse("interactions:interaction-unlike", args=[self.post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class CommentTest(InteractionAPITestSetup):
    def test_add_comment(self):
        url = reverse("interactions:interaction-comment", args=[self.post.id])
        data = {"text": "Nice post!"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Comment.objects.filter(user=self.user, post=self.post, text="Nice post!").exists())


class BookmarkTest(InteractionAPITestSetup):
    def test_bookmark_post(self):
        url = reverse("interactions:interaction-bookmark", args=[self.post.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Bookmark.objects.filter(user=self.user, post=self.post).exists())

    def test_unbookmark_post(self):
        Bookmark.objects.create(user=self.user, post=self.post)
        url = reverse("interactions:interaction-unbookmark", args=[self.post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Bookmark.objects.filter(user=self.user, post=self.post).exists())

    def test_unbookmark_without_bookmark(self):
        url = reverse("interactions:interaction-unbookmark", args=[self.post.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class RatingTest(InteractionAPITestSetup):
    def test_rate_post(self):
        url = reverse("interactions:interaction-rate", args=[self.post.id])
        data = {"value": settings.CONST_FIVE}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        rating = Rating.objects.get(user=self.user, post=self.post)
        self.assertEqual(rating.value, settings.CONST_FIVE)

    def test_rate_post_twice_fails(self):
        Rating.objects.create(user=self.user, post=self.post, value=settings.CONST_THREE)
        url = reverse("interactions:interaction-rate", args=[self.post.id])
        data = {"value": settings.CONST_FOUR}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already rated", str(response.data["detail"]))
