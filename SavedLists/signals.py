from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import SavedList

User = settings.AUTH_USER_MODEL

@receiver(post_save, sender=User)
def create_default_saved_list(sender, instance, created, **kwargs):
    if created:
        SavedList.objects.create(user=instance, name="Saved", is_default=True)
