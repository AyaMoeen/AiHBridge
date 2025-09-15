from rest_framework import serializers
from .models import SavedList, SavedListItem
from posts.serializers import PostSerializer

class SavedListSerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()
    class Meta:
        model = SavedList
        fields = ["id", "name", "description", "is_default", "created_at", "post_count"]
        read_only_fields = ["is_default", "created_at", "post_count"]
    def get_post_count(self, obj):
        return obj.items.count()


class SavedListDetailSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = SavedList
        fields = ["id", "name", "description", "is_default", "created_at", "items"]

    def get_items(self, obj):
        posts = [item.post for item in obj.items.select_related("post")]
        return PostSerializer(posts, many=True, context=self.context).data


class SavedListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedListItem
        fields = ["id", "saved_list", "post", "added_at"]
        read_only_fields = ["added_at"]
