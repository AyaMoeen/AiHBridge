from rest_framework import serializers
from .models import Reaction, Comment, Bookmark, Rating



class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = ["id", "user", "post", "created_at"]
        read_only_fields = ["user", "created_at", "post",]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "user", "post", "text", "created_at"]
        read_only_fields = ["user", "created_at", "post",]


class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ["id", "user", "post", "added_at"]
        read_only_fields = ["user", "added_at", "post"]

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ["id", "user", "post", "value", "created_at", "updated_at"]
        read_only_fields = ["user", "post", "created_at", "updated_at"]
