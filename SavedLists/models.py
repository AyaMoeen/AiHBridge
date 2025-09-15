from django.db import models
from django.conf import settings
from posts.models import Post

User = settings.AUTH_USER_MODEL

class SavedList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="saved_lists")
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, default="")
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "name")

    def __str__(self):
        return f"{self.name} ({self.user})"


class SavedListItem(models.Model):
    saved_list = models.ForeignKey(SavedList, on_delete=models.CASCADE, related_name="items")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="in_saved_lists")
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("saved_list", "post")

    def __str__(self):
        return f"{self.post} in {self.saved_list.name}"
