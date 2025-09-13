from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("recipient", "actor", "verb", "read", "timestamp")
    list_filter = ("read", "timestamp")
    search_fields = ("recipient__email", "actor__email", "verb")