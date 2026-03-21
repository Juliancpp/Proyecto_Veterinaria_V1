from rest_framework import permissions, viewsets

from apps.clinics.models import Clinic
from apps.clinics.permissions import IsAdminOrReadOnly
from apps.clinics.serializers import ClinicSerializer


class ClinicViewSet(viewsets.ModelViewSet):
    """
    CRUD for veterinary clinics.

    - GET    /api/clinics/       → list (authenticated, flat array)
    - POST   /api/clinics/       → create (admin only)
    - GET    /api/clinics/{id}/  → retrieve
    - PUT    /api/clinics/{id}/  → update (admin only)
    - DELETE /api/clinics/{id}/  → destroy (admin only)
    """

    queryset = Clinic.objects.all()
    serializer_class = ClinicSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
    pagination_class = None  # frontend expects flat array
