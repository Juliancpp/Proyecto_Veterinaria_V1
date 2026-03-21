from rest_framework import serializers

from apps.pets.models import Pet, PetInteraction


class PetSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Pet
        fields = (
            'id', 'name', 'age', 'breed', 'description', 'image',
            'status', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class PetCreateSerializer(serializers.ModelSerializer):
    """Accepts image uploads directly."""

    class Meta:
        model = Pet
        fields = ('id', 'name', 'age', 'breed', 'description', 'image', 'status')
        read_only_fields = ('id',)


class PetInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetInteraction
        fields = ('id', 'user', 'pet', 'liked', 'created_at')
        read_only_fields = ('id', 'user', 'pet', 'liked', 'created_at')
