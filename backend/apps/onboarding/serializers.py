from rest_framework import serializers

from apps.onboarding.models import Onboarding


class OnboardingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Onboarding
        fields = ('id', 'user', 'preferences', 'completed', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')
