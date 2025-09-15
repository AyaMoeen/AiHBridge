from .models import Reaction, Rating

def like_post(user, post):
    return Reaction.objects.get_or_create(user=user, post=post)

def unlike_post(user, post):
    reaction = Reaction.objects.filter(user=user, post=post).first()
    if reaction:
        reaction.delete()
        return True
    return False

#def bookmark_post(user, post):
 #   return Bookmark.objects.get_or_create(user=user, post=post)

#def unbookmark_post(user, post):
 #   bookmark = Bookmark.objects.filter(user=user, post=post).first()
  #  if bookmark:
   #     bookmark.delete()
    #    return True
    #return False

def rate_post(user, post, value):
    if Rating.objects.filter(user=user, post=post).exists():
        raise ValueError("You have already rated this post")
    return Rating.objects.create(user=user, post=post, value=value)
