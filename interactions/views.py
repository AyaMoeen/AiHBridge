from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .serializers import ReactionSerializer, CommentSerializer, BookmarkSerializer, RatingSerializer
from .mixins import PostMixin
from . import services
from accounts.serializers import UserSerializer

class InteractionViewSet(PostMixin, viewsets.ViewSet):
    """
    ViewSet for interacting with posts: like, unlike, comment, bookmark, unbookmark, rate.
    """
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_post_by_id(pk)
        reaction, created = services.like_post(request.user, post)
        serializer = ReactionSerializer(reaction)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'])
    def unlike(self, request, pk=None):
        post = self.get_post_by_id(pk)
        if services.unlike_post(request.user, post):
            return Response({"detail": "Unliked"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "You have not liked this post"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        post = self.get_post_by_id(pk)
        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, post=post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def bookmark(self, request, pk=None):
        post = self.get_post_by_id(pk)
        bookmark, created = services.bookmark_post(request.user, post)
        serializer = BookmarkSerializer(bookmark)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'])
    def unbookmark(self, request, pk=None):
        post = self.get_post_by_id(pk)
        if services.unbookmark_post(request.user, post):
            return Response({"detail": "Removed from bookmarks"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "You have not bookmarked this post"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        post = self.get_post_by_id(pk)
        try:
            rating = services.rate_post(request.user, post, request.data.get("value"))
            serializer = RatingSerializer(rating)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            raise ValidationError({"detail": str(e)})

    def get_post_by_id(self, pk):
        return self.get_post(pk)  

    @action(detail=True, methods=['get'])
    def likes(self, request, pk=None):
        post = self.get_post_by_id(pk)
        reactions = post.reactions.select_related("user")
        data = UserSerializer([r.user for r in reactions], many=True).data
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        post = self.get_post_by_id(pk)
        comments = post.comments.select_related("user")
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def bookmarks(self, request):
        bookmarks = request.user.bookmarks.select_related("post")
        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def liked(self, request):
        reactions = request.user.reactions.values_list("post_id", flat=True)
        return Response({"liked_posts": list(reactions)}, status=status.HTTP_200_OK)


