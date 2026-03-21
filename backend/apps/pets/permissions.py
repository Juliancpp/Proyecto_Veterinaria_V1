from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsStaffOrAdminOrReadOnly(BasePermission):
    """Staff/Admin can write; everyone else can only read."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('staff', 'admin')
        )
