from rest_framework import serializers

from apps.adoptions.models import AdoptionRequest
from apps.pets.serializers import PetSerializer
from apps.users.serializers import UserSerializer


class AdoptionRequestSerializer(serializers.ModelSerializer):
    """Read serializer with nested user/pet data."""
    user_data = UserSerializer(source='user', read_only=True)
    pet_data = PetSerializer(source='pet', read_only=True)

    class Meta:
        model = AdoptionRequest
        fields = (
            'id', 'user', 'pet', 'user_data', 'pet_data',
            'status', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')


class AdoptionRequestCreateSerializer(serializers.ModelSerializer):
    """Create serializer — only needs pet id."""

    class Meta:
        model = AdoptionRequest
        fields = ('id', 'pet')
        read_only_fields = ('id',)

    def validate(self, attrs):
        user = self.context['request'].user
        pet = attrs['pet']
        if AdoptionRequest.objects.filter(user=user, pet=pet).exists():
            raise serializers.ValidationError(
                'Ya tienes una solicitud de adopción para esta mascota.'
            )
        return attrs


class AdoptionStatusSerializer(serializers.ModelSerializer):
    """For admin/staff to approve/reject."""

    class Meta:
        model = AdoptionRequest
        fields = ('status',)
