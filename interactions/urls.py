from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import InteractionViewSet

app_name = "interactions"

router = DefaultRouter()
router.register(r'posts', InteractionViewSet, basename='interaction')

urlpatterns = [
    path('', include(router.urls)),
]
