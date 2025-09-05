from rest_framework import serializers
from posts.models import Post

class SearchPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'personal_review', 'categories', 'created_at', 'user']
        read_only_fields = ['id', 'created_at', 'user']