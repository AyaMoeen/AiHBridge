from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import User
from posts.models import Post, Category
from django.conf import settings


class SearchPostsViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="aya@gmail.com",
            password="123456"
        )
        self.category = Category.objects.create(name="Tech")
        self.post1 = Post.objects.create(
            user=self.user,
            title="Notion AI",
            description="Notion AI is an integrated AI assistant within Notion that helps with writing, brainstorming, editing, and summarizing content.",
            personal_review="Notion AI has been a game-changer for my productivity."
        )
        self.post1.categories.add(self.category)

        self.post2 = Post.objects.create(
            user=self.user,
            title="Gemini AI",
            description="Gemini AI is a next-generation AI model developed by Google DeepMind, designed to compete with other advanced models like GPT-4 and Claude 3.",
            personal_review="Gemini AI shows great promise in advancing AI capabilities."
        )
        self.post2.categories.add(self.category)

        self.url = reverse("search:search-posts")

    def test_search_with_exact_title_match(self):
        response = self.client.get(self.url, {"q": "Notion"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), settings.CONST_ONE)
        self.assertEqual(response.data[settings.CONST_ZERO]["title"], "Notion AI")

    def test_search_with_description_match(self):
        response = self.client.get(self.url, {"q": "Gemini"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), settings.CONST_ONE)
        self.assertEqual(response.data[settings.CONST_ZERO]["title"], "Gemini AI")

    def test_search_with_empty_query(self):
        response = self.client.get(self.url, {"q": ""})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Missing search query")
        
    def test_search_with_no_results(self):
        response = self.client.get(self.url, {"q": "CHATGPT"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), settings.CONST_ZERO)


class AutocompleteViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="raghad@gmail.com",
            password="123456"
        )
        self.post1 = Post.objects.create(
            user=self.user,
            title="Copilot",
            description="AI tool by GitHub",
            personal_review="Helpful for coding"
        )
        self.post2 = Post.objects.create(
            user=self.user,
            title="Deepseek AI",
            description="AI search engine",
            personal_review="Innovative"
        )
        self.post3 = Post.objects.create(
            user=self.user,
            title="Cloud AI",
            description="AI services on cloud",
            personal_review="Scalable"
        )
        self.url = reverse("search:search-autocomplete")

    def test_autocomplete_with_prefix(self):
        response = self.client.get(self.url, {"q": "AI"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Deepseek AI", response.data)
        self.assertIn("Cloud AI", response.data)
        self.assertNotIn("Copilot", response.data)

    def test_autocomplete_with_empty_query(self):
        response = self.client.get(self.url, {"q": ""})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Missing search query")

    def test_autocomplete_limit(self):
        for i in range(settings.RANGE):
            Post.objects.create(
                user=self.user,
                title=f"AI Post {i}",
                description="Spam",
                personal_review="Test"
            )
        response = self.client.get(self.url, {"q": "AI"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertLessEqual(len(response.data), settings.LIMIT)  
