from django.db import models
from django.conf import settings

class Notification(models.Model):
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="notifications",
        on_delete=models.CASCADE,
    )
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="actor_notifications",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    verb = models.CharField(max_length=255)  
    data = models.JSONField(default=dict, blank=True) 
    read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        indexes = [models.Index(fields=["recipient", "read", "timestamp"])]

    def mark_read(self):
        if not self.read:
            self.read = True
            self.save(update_fields=["read"])
