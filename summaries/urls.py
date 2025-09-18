from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SummarizeViewSet

router = DefaultRouter()
router.register(r"summarize", SummarizeViewSet, basename="summarize")

urlpatterns = [
    path("", include(router.urls)),
]
