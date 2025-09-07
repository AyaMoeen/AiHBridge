from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = ["id", "user_id", "email", "bio", "profile_picture"]
