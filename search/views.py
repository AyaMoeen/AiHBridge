from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .utils import search_posts_ranked, keyword_search, autocomplete_titles
from .serializers import SearchPostSerializer
from rest_framework import status

class SearchPostsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.GET.get('q', '')
        if not query:
            return Response({"detail": "Missing search query"}, status=status.HTTP_400_BAD_REQUEST)

        posts = search_posts_ranked(query)

        if not posts.exists():
            posts = keyword_search(query)

        serializer = SearchPostSerializer(posts, many=True)
        return Response(serializer.data)


class AutocompleteView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.GET.get('q', '')
        if not query:
            return Response({"detail": "Missing search query"}, status=status.HTTP_400_BAD_REQUEST)

        posts = autocomplete_titles(query)
        titles = [post.title for post in posts]
        return Response(titles)
