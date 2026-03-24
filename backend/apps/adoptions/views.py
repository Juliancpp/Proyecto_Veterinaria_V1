from rest_framework import permissions, viewsets
from rest_framework.response import Response

from apps.adoptions.models import AdoptionRequest
from apps.adoptions.permissions import IsAdminOrStaffForAdoptions
from apps.adoptions.serializers import (
    AdoptionRequestCreateSerializer,
    AdoptionRequestSerializer,
    AdoptionStatusSerializer,
)


class AdoptionRequestViewSet(viewsets.ModelViewSet):
    """
    Adoption request management.

    - GET    /api/adoptions/       → list (users see own; staff/admin see all)
    - POST   /api/adoptions/       → create (any authenticated user)
    - GET    /api/adoptions/{id}/  → retrieve
    - PATCH  /api/adoptions/{id}/  → update status (staff/admin only)
    """

    permission_classes = [permissions.IsAuthenticated, IsAdminOrStaffForAdoptions]
    pagination_class = None
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        if user.role in ('staff', 'admin'):
            return AdoptionRequest.objects.select_related('user', 'pet').all()
        return AdoptionRequest.objects.select_related('user', 'pet').filter(user=user)

    def get_serializer_class(self):
        if self.action == 'create':
            return AdoptionRequestCreateSerializer
        if self.action == 'partial_update':
            return AdoptionStatusSerializer
        return AdoptionRequestSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance.status = serializer.validated_data['status']
        instance.save(update_fields=['status', 'updated_at'])
        return Response(AdoptionRequestSerializer(instance, context={'request': request}).data)
