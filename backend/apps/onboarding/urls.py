from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.onboarding.views import OnboardingViewSet

router = DefaultRouter()
router.register(r'', OnboardingViewSet, basename='onboarding')

urlpatterns = [
    path('', include(router.urls)),
]
