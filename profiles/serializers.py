from rest_framework import serializers
from .models import Profile
<<<<<<< Updated upstream
=======
from posts.models import Category
from posts.serializers import CategorySerializer
>>>>>>> Stashed changes

class ProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
<<<<<<< Updated upstream

    class Meta:
        model = Profile
        fields = ["id", "user_id", "email", "bio", "profile_picture"]
=======
    username=serializers.CharField(source="user.username", read_only=True)
    name=serializers.CharField(source="user.name", read_only=True)
    created_at = serializers.DateTimeField(source='user.date_joined', read_only=True)
    
    interested_category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        many=True,
        source="interested_categories",
        write_only=True,
        required=False
    )
    
    interested_categories = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = ["id", "user_id", "email", "username", "name", "created_at", "bio", "profile_picture",
                  "interested_categories", "interested_category_ids"]
>>>>>>> Stashed changes
