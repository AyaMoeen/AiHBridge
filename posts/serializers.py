from rest_framework import serializers
from .models import Post, Category
from django.db.models import Avg


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'




class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    name = serializers.CharField(source="user.name", read_only=True)
    profile_picture = serializers.ImageField(source="user.profile.profile_picture", read_only=True)

    like_count = serializers.IntegerField(source="reactions.count", read_only=True)
    comment_count = serializers.IntegerField(source="comments.count", read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    avg_rating = serializers.FloatField(read_only=True)
    
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        many=True,
        write_only=True,
        source="categories"
    )

    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
        'id', 'user', 'title', 'link', 'description',
        'personal_review', 'categories', 'category_ids', 'created_at', 'updated_at',
        'username', 'name', 'profile_picture', 'like_count', 'comment_count',
        'avg_rating'
        ]

        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
        
    def to_representation(self, instance):
        """Add avg_rating dynamically from related Ratings"""
        data = super().to_representation(instance)
        avg_rating = instance.ratings.aggregate(avg=Avg("value"))["avg"]
        data["avg_rating"] = round(avg_rating, 2) if avg_rating else 0.0
        return data
    
    def create(self, validated_data):
        categories = validated_data.pop("categories", [])
        post = Post.objects.create(**validated_data)
        post.categories.set(categories)
        return post
