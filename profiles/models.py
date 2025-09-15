from django.db import models
from django.contrib.auth import get_user_model
from posts.models import Category

User = get_user_model()

class Profile(models.Model):
    """
    Profile model to extend user with bio and profile picture.
    """    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True, default="")
    profile_picture = models.ImageField(
        upload_to="profile_pics/",
        default="profile_pics/defaultpic.png",
        blank=True
    )
    interested_categories = models.ManyToManyField(Category, blank=True, related_name="interested_profiles")

    def __str__(self):
        return f"{self.user.email}'s Profile"
