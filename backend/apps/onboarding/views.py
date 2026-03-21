from rest_framework import permissions, status, viewsets
from rest_framework.response import Response

from apps.onboarding.models import Onboarding
from apps.onboarding.serializers import OnboardingSerializer


class OnboardingViewSet(viewsets.ModelViewSet):
    """
    Manage onboarding for the authenticated user.

    - POST /api/onboarding/  → create preferences
    - GET  /api/onboarding/  → retrieve own preferences
    - PATCH /api/onboarding/{id}/ → update preferences
    """

    serializer_class = OnboardingSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_queryset(self):
        return Onboarding.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        """Return the single onboarding object for the current user (or 404)."""
        try:
            instance = Onboarding.objects.get(user=request.user)
        except Onboarding.DoesNotExist:
            return Response(
                {'detail': 'Onboarding not started.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(OnboardingSerializer(instance).data)
