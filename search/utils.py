from django.db.models import Q, Case, When, IntegerField
from posts.models import Post
from django.conf import settings

def search_posts_ranked(query):
    """
    Return posts matching query with relevance ranking.
    Title high weight, description medium, review low.
    """
    return Post.objects.annotate(
        relevance=Case(
            When(title__icontains=query, then=settings.CONST_THREE),
            When(description__icontains=query, then=settings.CONST_TWO),
            When(personal_review__icontains=query, then=settings.CONST_ONE),
            default=settings.CONST_ZERO,
            output_field=IntegerField()
        )
    ).filter(relevance__gt=settings.CONST_ZERO).order_by('-relevance', '-created_at')

def keyword_search(query):
    """
    Split query into words and search each word.
    """
    words = query.split()
    q_objects = Q()
    for word in words:
        q_objects |= Q(title__icontains=word)
        q_objects |= Q(description__icontains=word)
        q_objects |= Q(personal_review__icontains=word)
    return Post.objects.filter(q_objects).distinct()

def autocomplete_titles(query, limit=settings.LIMIT):
    """
    Return first N titles starting with query (prefix match)
    """
    return Post.objects.filter(title__icontains=query)[:limit]
