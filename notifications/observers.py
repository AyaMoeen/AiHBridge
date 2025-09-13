from observer.events import Event
from observer.dispatcher import dispatcher
from .models import Notification
from django.contrib.auth import get_user_model

User = get_user_model()

FOLLOWED = "user.followed"
UNFOLLOWED = "user.unfollowed"

def _handle_user_followed(event: Event) -> None:
    """Create a simple in-app notification for a follow."""
    payload = event.payload
    follower_id = payload.get("follower_id")
    following_id = payload.get("following_id")
    try:
        follower = User.objects.get(pk=follower_id)
        following = User.objects.get(pk=following_id)
    except User.DoesNotExist:
        return

    Notification.objects.create(
        recipient=following,
        actor=follower,
        verb="followed you",
        data={"follower_id": follower_id},
    )

def _handle_user_unfollowed(event: Event) -> None:
    payload = event.payload
    follower_id = payload.get("follower_id")
    following_id = payload.get("following_id")

    Notification.objects.filter(
        recipient_id=following_id,
        actor_id=follower_id,
        verb="followed you"
    ).delete()

def register_observers():
    dispatcher.subscribe(FOLLOWED, _handle_user_followed)
    dispatcher.subscribe(UNFOLLOWED, _handle_user_unfollowed)
