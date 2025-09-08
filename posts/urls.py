# posts/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet,CategoryViewSet

app_name = "posts"

router = DefaultRouter()
router.register(r"", PostViewSet, basename="post")
category_router = DefaultRouter()
category_router.register(r"", CategoryViewSet, basename="category")

urlpatterns = [
    path("", include(router.urls)),
    path("categories", include(category_router.urls)),
]

