from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allow any access to read methods.
    Only allow write access to admin users.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class IsAuthorOrAdmin(permissions.BasePermission):
    """
    Allow write access only to the author or admin.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff