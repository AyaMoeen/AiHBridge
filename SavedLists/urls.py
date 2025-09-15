from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import SavedListViewSet

app_name = "SavedLists"

router = DefaultRouter()
router.register(r'', SavedListViewSet, basename='savedlist')

urlpatterns = [
    path('', include(router.urls)),
]

