from django.contrib.auth import authenticate, get_user_model
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.permissions import IsAdmin
from apps.users.serializers import (
    LoginSerializer,
    RegisterSerializer,
    UserAdminSerializer,
    UserSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — Register a new user and return JWT token."""

    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'token': str(refresh.access_token),
                'user': UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """POST /api/auth/login/ — Authenticate and return JWT token."""

    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer  # for Swagger schema

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password'],
        )

        if user is None:
            return Response(
                {'detail': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'token': str(refresh.access_token),
                'user': UserSerializer(user).data,
            },
        )


class MeView(generics.RetrieveAPIView):
    """GET /api/auth/me/ — Return the profile of the authenticated user."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserViewSet(viewsets.ModelViewSet):
    """
    Admin-only user management.

    - GET    /api/users/       → list all users
    - PATCH  /api/users/{id}/  → update role / is_active
    - DELETE /api/users/{id}/  → delete user
    """

    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    pagination_class = None  # frontend expects flat array
    http_method_names = ['get', 'patch', 'delete', 'head', 'options']
