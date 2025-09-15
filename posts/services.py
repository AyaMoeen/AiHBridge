from django.db.models import Count, Avg
from posts.models import Post

class PostRankingService:
    @staticmethod
    def get_top_posts(limit=10):
        return (
            Post.objects
            .annotate(
                likes_count=Count("reactions", distinct=True),
                comments_count=Count("comments", distinct=True),
                avg_rating=Avg("ratings__value")
            )
            .order_by("-likes_count", "-comments_count", "-avg_rating")[:limit]
        )
