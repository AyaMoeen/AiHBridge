from rest_framework import serializers
from .models import Post, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), many=True, write_only=True, source="categories"
    )
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'user', 'title', 'link', 'description',
            'personal_review', 'categories', 'category_ids',
            'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        categories = validated_data.pop("categories", [])
        post = Post.objects.create(**validated_data)
        post.categories.set(categories)
        return post
