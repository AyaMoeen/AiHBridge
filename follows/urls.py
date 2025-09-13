from rest_framework.routers import DefaultRouter
from django.urls import include, path
from .views import FollowViewSet

app_name = "follows"

router = DefaultRouter()
router.register(r"users", FollowViewSet, basename="follow")

urlpatterns = [
    path("", include(router.urls)),
]
