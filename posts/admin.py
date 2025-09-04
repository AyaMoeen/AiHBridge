from django.contrib import admin
from .models import Post, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at', 'updated_at')
    list_filter = ('categories', 'created_at', 'updated_at', 'user')
    search_fields = ('title', 'description', 'personal_review', 'user__email')
    filter_horizontal = ('categories',)
    ordering = ('-created_at',)
