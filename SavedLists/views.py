from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import SavedList, SavedListItem
from .serializers import SavedListSerializer, SavedListDetailSerializer, SavedListItemSerializer
from posts.models import Post

class SavedListViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SavedListSerializer

    def get_queryset(self):
        return SavedList.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_class(self):
        if self.action in ("retrieve",):
            return SavedListDetailSerializer
        return SavedListSerializer

    @action(detail=False, methods=["post"])
    def bookmark(self, request):
        post_id = request.data.get("post_id")
        saved_list_id = request.data.get("saved_list_id")

        post = get_object_or_404(Post, pk=post_id)
        default_list = SavedList.objects.filter(user=request.user, is_default=True).first()
        SavedListItem.objects.get_or_create(saved_list=default_list, post=post)
        if saved_list_id:
            extra_list = get_object_or_404(SavedList, pk=saved_list_id, user=request.user)
            SavedListItem.objects.get_or_create(saved_list=extra_list, post=post)

        return Response({"detail": "Post bookmarked successfully"}, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=["delete"])
    def unbookmark(self, request):
        post_id = request.data.get("post_id")
        post = get_object_or_404(Post, pk=post_id)
        SavedListItem.objects.filter(saved_list__user=request.user, post=post).delete()
        return Response({"detail": "Post removed from all lists"}, status=status.HTTP_204_NO_CONTENT)


#    @action(detail=True, methods=['post'], url_path='posts/(?P<post_id>[^/.]+)')
 #   def add_post(self, request, pk=None, post_id=None):
  #      saved_list = get_object_or_404(SavedList, id=pk, user=request.user)
   #     post = get_object_or_404(Post, id=post_id)
    #    item, created = SavedListItem.objects.get_or_create(saved_list=saved_list, post=post)
     #   serializer = SavedListItemSerializer(item)
      #  return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
    #@action(detail=True, methods=['delete'], url_path='posts/(?P<post_id>[^/.]+)')
    #def remove_post(self, request, pk=None, post_id=None):
     #   saved_list = get_object_or_404(SavedList, id=pk, user=request.user)
      #  post = get_object_or_404(Post, id=post_id)
       # saved_list.posts.remove(post)
        #return Response({"detail": f"Post {post_id} removed from list {pk}"}, status=status.HTTP_204_NO_CONTENT)