from django.urls import path
from django.views.generic import TemplateView
from . import views
app_name = "posts"


urlpatterns = [

    path('', views.PostListCreateView.as_view(), name='post-list'),
    path('<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
]

    # Categories
    #path('categories/', views.CategoryListCreateView.as_view(), name='category-list'),
    #path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),

    # Posts
    
#urlpatterns = [
 #   path('', TemplateView.as_view(template_name='index.html')),
#]