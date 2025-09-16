from django.urls import path
from .views import SummarizeView

urlpatterns = [
    path("summarize/", SummarizeView.as_view(), name="summarize"),
]
