from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsStaffOrAdminForReports(BasePermission):
    """
    - Any authenticated user can create a report.
    - Only staff / admin can list all reports and update status.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if view.action == 'create':
            return True
        return request.user.role in ('staff', 'admin')
