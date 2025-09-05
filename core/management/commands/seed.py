from django.core.management.base import BaseCommand
from accounts.models import User
from posts.models import Category, Post
import random

USERS = 5

class Command(BaseCommand):
    help = "Seeds the database with AI tool data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding database...")

        Post.objects.all().delete()
        Category.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

        users = []
        for i in range(USERS):
            user = User.objects.create_user(
                email=f"user{i}@gmail.com",
                password="123456",
                name=f"User {i}"
            )
            users.append(user)
        self.stdout.write(self.style.SUCCESS(f"{USERS} Users created."))

        category_names = [
            "AI Productivity Tools",
            "AI Video Tools",
            "AI Text Generators",
            "AI Business Tools",
            "AI Image Tools",
            "Automation Tools",
            "AI Art Generators",
            "AI Audio Generators",
            "AI Code Tools",
            "Misc AI Tools"
        ]
        categories = [Category(name=name) for name in category_names]
        Category.objects.bulk_create(categories)
        categories = list(Category.objects.all())
        self.stdout.write(self.style.SUCCESS(f"{len(categories)} Categories created."))

        posts_data = [
            {"title": "Notion AI: Your Personal Writing Assistant",
             "link": "https://www.notion.so/ai",
             "description": "An integrated AI assistant within Notion for writing, brainstorming, editing, and summarizing content.",
             "personal_review": "Notion AI has transformed my productivity and helped me organize thoughts and write better content."},

            {"title": "Canva Magic Studio: AI-Powered Design",
             "link": "https://www.canva.com/magic-studio",
             "description": "AI tools in Canva for generating designs, layouts, and content.",
             "personal_review": "Canva Magic Studio makes designing fast, intuitive, and fun."},

            {"title": "Jasper: AI Content Generator",
             "link": "https://www.jasper.ai",
             "description": "Create high-quality AI-generated content quickly.",
             "personal_review": "Jasper significantly reduces content creation time and improves quality."},

            {"title": "Synthesia: AI Video Creation",
             "link": "https://www.synthesia.io",
             "description": "Generate professional videos from text input using AI.",
             "personal_review": "Synthesia allows me to produce videos without a camera crew."},

            {"title": "Runway: AI Video Editing",
             "link": "https://www.runwayml.com",
             "description": "AI-powered creative suite for video editing and production.",
             "personal_review": "Runway's AI editing tools save time and enhance creativity."},

            {"title": "Midjourney: AI Image Generation",
             "link": "https://www.midjourney.com",
             "description": "Generate unique images from text prompts with AI.",
             "personal_review": "Midjourney helps me explore new creative possibilities effortlessly."},

            {"title": "Perplexity: AI Search Engine",
             "link": "https://www.perplexity.ai",
             "description": "AI search engine providing accurate, context-aware results.",
             "personal_review": "Perplexity improves research efficiency with precise answers."},

            {"title": "Zapier Agents: AI Automation",
             "link": "https://www.zapier.com",
             "description": "Automate workflows and integrate apps using AI.",
             "personal_review": "Zapier automates repetitive tasks, saving valuable time."},

            {"title": "DeepL: AI Translation",
             "link": "https://www.deepl.com",
             "description": "Accurate AI-powered translation tool.",
             "personal_review": "DeepL ensures fast and precise multilingual communication."},

            {"title": "Fathom: AI Meeting Assistant",
             "link": "https://www.fathom.video",
             "description": "Summarizes meeting discussions and action items automatically.",
             "personal_review": "Fathom captures all meeting highlights, ensuring nothing is missed."},

            {"title": "ChatGPT: AI Conversational Assistant",
             "link": "https://chat.openai.com/",
             "description": "AI chatbot capable of natural language understanding and generation.",
             "personal_review": "ChatGPT answers questions and helps brainstorm ideas efficiently."},

            {"title": "RunDiffusion: AI Image Generation",
             "link": "https://rundiffusion.com",
             "description": "Generate high-quality images from text with AI.",
             "personal_review": "RunDiffusion enables professional image creation quickly."},

            {"title": "Tome AI: AI-Powered Presentations",
             "link": "https://tome.app",
             "description": "Create presentations using AI to generate slides and storytelling.",
             "personal_review": "Tome AI turns ideas into compelling presentations effortlessly."},

            {"title": "Replit Ghostwriter: AI Coding Assistant",
             "link": "https://replit.com",
             "description": "AI assistant for coding, autocomplete, and suggestions.",
             "personal_review": "Ghostwriter makes coding faster and reduces errors significantly."},

            {"title": "Lumen5: AI Video Marketing Tool",
             "link": "https://lumen5.com",
             "description": "Convert text content into engaging AI-generated videos.",
             "personal_review": "Lumen5 simplifies content marketing with beautiful video outputs."}
        ]

        post_category_mapping = {
            "Notion AI: Your Personal Writing Assistant": ["AI Productivity Tools"],
            "Canva Magic Studio: AI-Powered Design": ["AI Image Tools", "AI Productivity Tools"],
            "Jasper: AI Content Generator": ["AI Text Generators", "AI Productivity Tools"],
            "Synthesia: AI Video Creation": ["AI Video Tools"],
            "Runway: AI Video Editing": ["AI Video Tools", "AI Image Tools"],
            "Midjourney: AI Image Generation": ["AI Image Tools", "AI Art Generators"],
            "Perplexity: AI Search Engine": ["AI Productivity Tools", "AI Business Tools"],
            "Zapier Agents: AI Automation": ["Automation Tools", "AI Business Tools"],
            "DeepL: AI Translation": ["AI Productivity Tools", "AI Business Tools"],
            "Fathom: AI Meeting Assistant": ["AI Productivity Tools"],
            "ChatGPT: AI Conversational Assistant": ["AI Text Generators", "AI Productivity Tools"],
            "RunDiffusion: AI Image Generation": ["AI Image Tools", "AI Art Generators"],
            "Tome AI: AI-Powered Presentations": ["AI Productivity Tools", "AI Business Tools"],
            "Replit Ghostwriter: AI Coding Assistant": ["AI Code Tools", "AI Productivity Tools"],
            "Lumen5: AI Video Marketing Tool": ["AI Video Tools", "AI Business Tools"]
        }

        posts = []
        for data in posts_data:
            post = Post(
                user=random.choice(users),
                title=data["title"],
                link=data["link"],
                description=data["description"],
                personal_review=data["personal_review"]
            )
            posts.append(post)
        Post.objects.bulk_create(posts)
        posts = list(Post.objects.all())

        for post in posts:
            category_names_for_post = post_category_mapping.get(post.title, [])
            relevant_categories = [c for c in categories if c.name in category_names_for_post]
            post.categories.set(relevant_categories)

        self.stdout.write(self.style.SUCCESS(f"{len(posts)} AI posts created."))
        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
