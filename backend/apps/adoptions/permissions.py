from rest_framework.permissions import BasePermission


class IsAdminOrStaffForAdoptions(BasePermission):
    """
    - Any authenticated user can create and list their own adoptions.
    - Staff/Admin can list ALL adoptions and update status.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if view.action in ('create', 'list', 'retrieve'):
            return True
        # Only staff/admin can update
        return request.user.role in ('staff', 'admin')
