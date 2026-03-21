from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""

    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password', 'role')
        read_only_fields = ('id',)
        extra_kwargs = {
            'role': {'required': False},
        }

    def create(self, validated_data):
        from apps.users.services import UserService
        return UserService.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    """Serializer for JWT login – only used for Swagger docs / input validation."""

    email = serializers.EmailField()
    password = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):
    """Read-only serializer for the authenticated user profile."""

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role', 'is_active', 'onboarding_complete', 'date_joined')
        read_only_fields = fields


class UserAdminSerializer(serializers.ModelSerializer):
    """Serializer for admin user management."""

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role', 'is_active')
        read_only_fields = ('id', 'name', 'email')
