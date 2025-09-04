from django.core.management.base import BaseCommand
from accounts.models import User
from posts.models import Category, Post
import random

USERS = 5
POSTS = 10
MIN_RAND = 1
MAX_RAND = 3

class Command(BaseCommand):
    help = "Seeds the database with initial data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding database...")

        Post.objects.all().delete()
        Category.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

        users = []
        for i in range(USERS):
            user = User.objects.create_user(
                email=f"user{i}@example.com",
                password="password123",
                name=f"User {i}",
            )
            users.append(user)

        self.stdout.write(self.style.SUCCESS("5 Users created."))

        category_names = [
            "Technology", "Science", "Education", "Sports",
            "Travel", "Health", "Food", "Finance"
        ]
        categories = [Category(name=name) for name in category_names]
        Category.objects.bulk_create(categories)
        categories = list(Category.objects.all()) 
        
        self.stdout.write(self.style.SUCCESS(f"{len(categories)} Categories created."))

        posts = []
        for i in range(POSTS):
            posts.append(Post(
                user=random.choice(users),
                title=f"Sample Post {i}",
                link="https://example.com",
                description=f"Description for post {i}",
                personal_review=f"My review for post {i}",
            ))

        Post.objects.bulk_create(posts)
        posts = list(Post.objects.all()) 

        for post in posts:
            post.categories.set(random.sample(categories, k=random.randint(MIN_RAND, MAX_RAND)))

        self.stdout.write(self.style.SUCCESS(f"{len(posts)} Posts created."))

        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
