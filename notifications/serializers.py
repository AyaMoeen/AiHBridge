from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    actor_email = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ("id", "recipient", "actor", "actor_email", "verb", "data", "read", "timestamp")
        read_only_fields = ("id", "timestamp", "actor_email")

    def get_actor_email(self, obj):
        return getattr(obj.actor, "email", None)
