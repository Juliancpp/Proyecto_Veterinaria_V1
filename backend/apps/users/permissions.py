from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Allow access only to users with the 'admin' role."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'admin'
        )


class IsStaffUser(BasePermission):
    """Allow access to users with 'staff' or 'admin' role."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('staff', 'admin')
        )


class IsOwner(BasePermission):
    """Allow access only if the object is owned by the requesting user."""

    def has_object_permission(self, request, view, obj):
        # Works with any model that has a `user` FK or is the User model itself.
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user
