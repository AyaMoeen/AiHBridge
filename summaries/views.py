from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import SummarizeRequestSerializer
from .services import summarize_text

class SummarizeViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        """
        POST /summaries/summarize/
        """
        serializer = SummarizeRequestSerializer(data=request.data)
        if serializer.is_valid():
            text = serializer.validated_data["text"]
            summary = summarize_text(text)
            return Response({"summary": summary}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
