from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Reset info', {'fields': ('reset_code', 'reset_token', 'reset_code_created_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'username', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser')}
        ),
    )

    search_fields = ('email', 'username', 'name')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions')
