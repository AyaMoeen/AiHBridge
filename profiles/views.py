import json
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer
from django.contrib.auth import get_user_model
from posts.models import  Post
from posts.serializers import PostSerializer
from django.db.models import Count, Avg

User = get_user_model()

class ProfileViewSet(viewsets.ViewSet):
    """
    ViewSet to retrieve and update the current authenticated user's profile.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Profile.objects.select_related('user').prefetch_related('interested_categories')

    def list(self, request):
        """
        GET /profiles/ 
        """
        profile = self.get_queryset().get(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    @action(detail=False, methods=['patch', 'put'])
    def update_profile(self, request):
        """
        PATCH /profiles/update_profile/ 
        """
        profile = self.get_queryset().get(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path="highlighted-tools")
    def highlighted_tools(self, request):
        profile = request.user.profile

        posts = Post.objects.filter(
            categories__in=profile.interested_categories.all()
        ).annotate(
            likes_count=Count('reactions', distinct=True),
            comments_count=Count('comments', distinct=True),
            avg_rating=Avg('ratings__value')
        ).distinct().order_by(
            '-avg_rating'
        )
        #'-likes_count', '-comments_count', 
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="details")
    def profile_details(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            profile = user.profile
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProfileSerializer(profile, context={"request": request})
        posts = Post.objects.filter(user=user)
        posts_serializer = PostSerializer(posts, many=True, context={"request": request})

        return Response({
            "profile": serializer.data,
            "posts": posts_serializer.data
        })