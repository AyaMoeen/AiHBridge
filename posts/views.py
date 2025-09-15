from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post, Category
from .serializers import PostSerializer, CategorySerializer
from .services import PostRankingService

# Permissions management
class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class PostViewSet(viewsets.ModelViewSet):

    serializer_class = PostSerializer
    queryset = Post.objects.all()  # dummy, actual filtered in get_queryset

    def get_queryset(self):
        return (
            Post.objects
            .select_related("user", "user__profile")
            .prefetch_related("categories")
            .order_by("-created_at")
        )

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [permissions.AllowAny]
        elif self.action == "create":
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ["update", "partial_update", "destroy", "my_posts", "my_posts_count"]:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [perm() for perm in permission_classes]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def my_posts(self, request):
        posts = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def my_posts_count(self, request):
        count = self.get_queryset().filter(user=request.user).count()
        return Response({"my_posts_count": count}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["get"])
    def top_posts(self, request):
        """
        GET /posts/top_posts/ 
        """
        posts = PostRankingService.get_top_posts()
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
