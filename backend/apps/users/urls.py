from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.users.views import LoginView, MeView, RegisterView, UserViewSet

router = DefaultRouter()
router.register(r'', UserViewSet, basename='users')

auth_urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('me/', MeView.as_view(), name='auth-me'),
    # Proxy onboarding through /api/auth/ so the frontend can POST here
    path('onboarding/', include('apps.onboarding.urls')),
]

users_urlpatterns = [
    path('', include(router.urls)),
]
