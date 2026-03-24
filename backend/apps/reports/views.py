from rest_framework import permissions, status, viewsets
from rest_framework.response import Response

from apps.reports.models import Report
from apps.reports.permissions import IsStaffOrAdminForReports
from apps.reports.serializers import ReportSerializer, ReportUpdateSerializer
from apps.reports.services import ReportService


class ReportViewSet(viewsets.ModelViewSet):
    """
    - POST   /api/reports/          → create (any authenticated user)
    - GET    /api/reports/          → list   (staff / admin only)
    - GET    /api/reports/{id}/     → retrieve (staff / admin)
    - PATCH  /api/reports/{id}/     → approve / reject (staff / admin)
    """

    queryset = Report.objects.select_related('user').all()
    permission_classes = [permissions.IsAuthenticated, IsStaffOrAdminForReports]
    pagination_class = None  # frontend expects flat array
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_serializer_class(self):
        if self.action == 'partial_update':
            return ReportUpdateSerializer
        return ReportSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        report = self.get_object()
        serializer = self.get_serializer(report, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated = ReportService.update_status(
            report=report,
            new_status=serializer.validated_data['status'],
        )
        return Response(ReportSerializer(updated, context={'request': request}).data)
