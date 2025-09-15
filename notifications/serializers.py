from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    actor_email = serializers.SerializerMethodField()
    actor_name = serializers.SerializerMethodField()
    actor_profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ("id", "recipient", "actor", "actor_email", "verb", "data", "read", "timestamp",
                  "actor_name", "actor_profile_picture",)
        read_only_fields = ("id", "timestamp", "actor_email", "actor_name", "actor_profile_picture")

    def get_actor_email(self, obj):
        return getattr(obj.actor, "email", None)

    def get_actor_name(self, obj):
        return getattr(obj.actor, "name", None)

    def get_actor_profile_picture(self, obj):
        if hasattr(obj.actor, "profile") and obj.actor.profile.profile_picture:
            request = self.context.get("request")
            picture_url = obj.actor.profile.profile_picture.url
            if request is not None:
                return request.build_absolute_uri(picture_url)
            return picture_url
        return None
