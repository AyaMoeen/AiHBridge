from django.contrib import admin
from .models import Reaction, Comment, Bookmark, Rating


@admin.register(Reaction)
class ReactionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "post", "created_at")
    search_fields = ("user__email", "post__title")
    list_filter = ("created_at",)
    ordering = ("-created_at",)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "post", "text", "created_at")
    search_fields = ("user__email", "post__title", "text")
    list_filter = ("created_at", "user")
    ordering = ("-created_at",)


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "post", "added_at")
    search_fields = ("user__email", "post__title")
    list_filter = ("added_at",)
    ordering = ("-added_at",)


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "post", "value", "created_at", "updated_at")
    search_fields = ("user__email", "post__title")
    list_filter = ("value", "created_at", "updated_at")
    ordering = ("-created_at",)
