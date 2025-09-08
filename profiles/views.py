from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Profile
from .serializers import ProfileSerializer

class ProfileViewSet(viewsets.ViewSet):
    """
    ViewSet to retrieve and update the current authenticated user's profile.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Profile.objects.select_related('user')

    def list(self, request):
        """
        GET /profiles/ 
        """
        profile = self.get_queryset().get(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    @action(detail=False, methods=['patch', 'put'])
    def update_profile(self, request):
        """
        PATCH /profiles/update_profile/ 
        """
        profile = self.get_queryset().get(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
