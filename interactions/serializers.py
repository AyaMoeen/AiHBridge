from rest_framework import serializers
from .models import Reaction, Comment, Rating
from profiles.models import Profile  

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["name", "username", "profile_pic"]

class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = ["id", "user", "post", "created_at"]
        read_only_fields = ["user", "created_at", "post",]


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    name = serializers.CharField(source="user.name", read_only=True)
    profile_picture = serializers.ImageField(source="user.profile.profile_picture", read_only=True)
    class Meta:
        model = Comment
        fields = ["id", "user", 'username', 'name', 'profile_picture', "post", "text", "created_at"]
        read_only_fields = ["user", "created_at", "post", 'username', 'name', 'profile_picture',]

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ["id", "user", "post", "value", "created_at", "updated_at"]
        read_only_fields = ["user", "post", "created_at", "updated_at"]

#class BookmarkSerializer(serializers.ModelSerializer):
 #   class Meta:
  #      model = Bookmark
   #     fields = ["id", "user", "post", "added_at"]
    #    read_only_fields = ["user", "added_at", "post"]