from rest_framework import serializers

class SummarizeRequestSerializer(serializers.Serializer):
    text = serializers.CharField()
