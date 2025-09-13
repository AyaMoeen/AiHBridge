from django.db import models
from django.conf import settings

class Follow(models.Model):
    """Represents follower -> following relation."""
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="following_relations",
        on_delete=models.CASCADE,
    )
    following = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="follower_relations",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("follower", "following")
        indexes = [
            models.Index(fields=["follower"]),
            models.Index(fields=["following"]),
        ]

    def __str__(self):
        return f"{self.follower} -> {self.following}"
