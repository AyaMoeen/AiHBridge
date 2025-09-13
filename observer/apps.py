from django.apps import AppConfig


class ObserverConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'observer'
    verbose_name = "Observer infrastructure"

    def ready(self):
        pass

    