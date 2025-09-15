from django.db import models
from django.conf import settings
from posts.models import Post

class Reaction(models.Model):
    user: models.ForeignKey = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reactions")
    post: models.ForeignKey = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="reactions")
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "post")  

    def __str__(self):
        return f"{self.user} {self.post}"

class Comment(models.Model):
    user: models.ForeignKey = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    post: models.ForeignKey = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    text: models.TextField = models.TextField()
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user} on {self.post}"

#class Bookmark(models.Model):
 #   user: models.ForeignKey = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookmarks")
  #  post: models.ForeignKey = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="bookmarked_by")
   # added_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)

    #class Meta:
     #   unique_together = ("user", "post")  

    #def __str__(self):
     #   return f"{self.user} bookmarked {self.post}"

class Rating(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ratings")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="ratings")
    value = models.PositiveSmallIntegerField(default=0)  

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "post")  
        
    def __str__(self):
        return f"{self.user} rated {self.post} {self.value}"
