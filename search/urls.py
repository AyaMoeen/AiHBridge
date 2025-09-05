from django.urls import path
from . import views

app_name = "search"

urlpatterns = [
    path('', views.SearchPostsView.as_view(), name='search-posts'),
    path('autocomplete/', views.AutocompleteView.as_view(), name='autocomplete'),
]
