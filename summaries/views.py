from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SummarizeRequestSerializer
from .services import summarize_text

class SummarizeView(APIView):
    def post(self, request):
        serializer = SummarizeRequestSerializer(data=request.data)
        if serializer.is_valid():
            text = serializer.validated_data["text"]
            summary = summarize_text(text)
            return Response({"summary": summary}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
