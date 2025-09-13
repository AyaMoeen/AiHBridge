from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from .serializers import FollowSerializer
from . import services

User = get_user_model()

class FollowViewSet(viewsets.ViewSet):
    """
    ViewSet for following/unfollowing users.

    - POST /follows/{pk}/follow/  -> follow user {pk}
    - DELETE /follows/{pk}/unfollow/ -> unfollow user {pk}
    - GET /follows/ (optional) -> not implemented here (keep thin)
    """
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=["post"])
    def follow(self, request, pk=None):
        try:
            target = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        try:
            follow, created = services.follow_user(request.user, target)
            if not created:
                return Response({"detail": "Already following."}, status=status.HTTP_200_OK)
            serializer = FollowSerializer(follow, context={"request": request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            raise ValidationError({"detail": str(e)})

    @action(detail=True, methods=["delete"])
    def unfollow(self, request, pk=None):
        try:
            target = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        removed = services.unfollow_user(request.user, target)
        if removed:
            return Response({"detail": "Unfollowed."}, status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "You are not following this user."}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"])
    def followers(self, request, pk=None):
        """
        List all users following the target user (pk)
        """
        target = User.objects.get(pk=pk)
        followers_qs = services.get_followers(target) 
        serializer = FollowSerializer(followers_qs, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def following(self, request, pk=None):
        """
        List all users the target user (pk) is following
        """
        target = User.objects.get(pk=pk)
        following_qs = services.get_following(target) 
        serializer = FollowSerializer(following_qs, many=True, context={"request": request})
        return Response(serializer.data)
