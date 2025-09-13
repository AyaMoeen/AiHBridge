from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from .models import Follow
from observer.events import Event
from observer.dispatcher import dispatcher

User = get_user_model()

EVENT_NAME_USER_FOLLOWED = "user.followed"
EVENT_NAME_USER_UNFOLLOWED = "user.unfollowed"

def follow_user(follower: User, following: User) -> tuple[Follow | None, bool]:
    """
    Create a follow relation. Returns (Follow instance or None, created flag).
    Emits an observer event on success.
    """
    if follower.pk == following.pk:
        raise ValueError("Cannot follow yourself.")
    try:
        with transaction.atomic():
            follow, created = Follow.objects.get_or_create(follower=follower, following=following)
            if created:
                event = Event(
                    name=EVENT_NAME_USER_FOLLOWED,
                    payload={"follower_id": follower.pk, "following_id": following.pk},
                )
                dispatcher.publish(event)
            return follow, created
    except IntegrityError:
        return None, False

def unfollow_user(follower: User, following: User) -> bool:
    """
    Remove a follow relation. Returns True if removed.
    Emits an observer event when removed.
    """
    try:
        with transaction.atomic():
            deleted, _ = Follow.objects.filter(follower=follower, following=following).delete()
            if deleted:
                event = Event(
                    name=EVENT_NAME_USER_UNFOLLOWED,
                    payload={"follower_id": follower.pk, "following_id": following.pk},
                )
                dispatcher.publish(event)
            return bool(deleted)
    except Exception:
        return False

def is_following(follower: User, following: User) -> bool:
    return Follow.objects.filter(follower=follower, following=following).exists()

def get_followers(user: User):
    """
    Returns a queryset of Follow instances where the given user is being followed.
    """
    return Follow.objects.filter(following=user).select_related("follower")


def get_following(user: User):
    """
    Returns a queryset of Follow instances where the given user is following others.
    """
    return Follow.objects.filter(follower=user).select_related("following")

