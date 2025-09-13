from django.apps import AppConfig


class NotificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'notifications'
    verbose_name = "Notifications"

    def ready(self):
        from .observers import register_observers  
        register_observers()
