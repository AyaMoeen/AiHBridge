from django.shortcuts import get_object_or_404
from posts.models import Post

class PostMixin:
    """
    A reusable mixin to fetch the Post object based on post_id from URL kwargs.
    """

    def get_post(self, pk):
        from posts.models import Post
        return Post.objects.get(pk=pk)

