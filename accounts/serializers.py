from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "username", "email"]  
        
class RegisterSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(source='date_joined', read_only=True)
 
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'email', 'password', 'created_at']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': True}  
        }
        
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
