from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from posts.models import Post, Category
from .models import SavedList, SavedListItem

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

class SavedListsTests(APITestCase):
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

        self.default_list, _ = SavedList.objects.get_or_create(user=self.user, name="Saved", defaults={"is_default": True})
        self.extra_list = SavedList.objects.create(user=self.user, name="Extra List 2")



    def test_create_savedlist(self):
        url = reverse("SavedLists:savedlist-list")  
        data = {"name": "My List", "description": "Test desc"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_bookmark_post_default_list(self):
        url = reverse("SavedLists:savedlist-bookmark") 
        data = {"post_id": self.post.id}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(SavedListItem.objects.filter(saved_list=self.default_list, post=self.post).exists())

    def test_bookmark_post_extra_list(self):
        extra_list = SavedList.objects.create(user=self.user, name="Extra List")
        url = reverse("SavedLists:savedlist-bookmark")  
        data = {"post_id": self.post.id, "saved_list_id": extra_list.id}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(SavedListItem.objects.filter(saved_list=extra_list, post=self.post).exists())

    def test_unbookmark_post(self):
        SavedListItem.objects.create(saved_list=self.default_list, post=self.post)
        url = reverse("SavedLists:savedlist-unbookmark")  
        data = {"post_id": self.post.id}
        response = self.client.delete(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(SavedListItem.objects.filter(saved_list=self.default_list, post=self.post).exists())

    def test_list_savedlists_with_post_count(self):
        url = reverse("SavedLists:savedlist-list") 
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("post_count", response.data[0])
