from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .utils import search_posts_ranked, keyword_search, autocomplete_titles
from .serializers import SearchPostSerializer

class SearchViewSet(viewsets.ViewSet):
    """
    ViewSet for searching posts and providing autocomplete.
    """
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def posts(self, request):
        """
        GET /search/posts/?q=keyword → Search posts by query
        """
        query = request.GET.get('q', '')
        if not query:
            return Response({"detail": "Missing search query"}, status=status.HTTP_400_BAD_REQUEST)

        posts = search_posts_ranked(query)
        if not posts.exists():
            posts = keyword_search(query)

        serializer = SearchPostSerializer(posts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def autocomplete(self, request):
        """
        GET /search/autocomplete/?q=keyword → Autocomplete post titles
        """
        query = request.GET.get('q', '')
        if not query:
            return Response({"detail": "Missing search query"}, status=status.HTTP_400_BAD_REQUEST)

        posts = autocomplete_titles(query)
        titles = [post.title for post in posts]
        return Response(titles)
