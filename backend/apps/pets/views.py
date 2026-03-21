from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.pets.models import Pet
from apps.pets.permissions import IsStaffOrAdminOrReadOnly
from apps.pets.serializers import PetCreateSerializer, PetInteractionSerializer, PetSerializer
from apps.pets.services import PetService


class PetViewSet(viewsets.ModelViewSet):
    """
    CRUD for pets with pagination, filtering, and Tinder-style interactions.

    - GET    /api/pets/              → list (paginated, filterable)
    - GET    /api/pets/available/    → flat list of available pets (for adoption page)
    - POST   /api/pets/             → create (staff/admin)
    - GET    /api/pets/{id}/        → retrieve
    - PUT    /api/pets/{id}/        → update (staff/admin)
    - DELETE /api/pets/{id}/        → destroy (staff/admin)
    - POST   /api/pets/{id}/like/   → like a pet
    - POST   /api/pets/{id}/skip/   → skip a pet
    """

    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'age', 'name']

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return PetCreateSerializer
        return PetSerializer

    # ---------- Available pets (flat, no pagination) ----------

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def available(self, request):
        """GET /api/pets/available/ — Flat list of available pets for the adoption page."""
        pets = Pet.objects.filter(status=Pet.Status.AVAILABLE)
        serializer = PetSerializer(pets, many=True, context={'request': request})
        return Response(serializer.data)

    # ---------- Tinder-style actions ----------

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        """POST /api/pets/{id}/like/ — Mark a pet as liked."""
        pet = self.get_object()
        interaction = PetService.interact(user=request.user, pet=pet, liked=True)
        return Response(PetInteractionSerializer(interaction).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def skip(self, request, pk=None):
        """POST /api/pets/{id}/skip/ — Mark a pet as skipped."""
        pet = self.get_object()
        interaction = PetService.interact(user=request.user, pet=pet, liked=False)
        return Response(PetInteractionSerializer(interaction).data, status=status.HTTP_201_CREATED)
