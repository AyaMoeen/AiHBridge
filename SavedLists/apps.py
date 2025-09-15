from django.apps import AppConfig


class SavedlistsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'SavedLists'
    def ready(self):
        import SavedLists.signals
