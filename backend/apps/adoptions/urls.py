from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.adoptions.views import AdoptionRequestViewSet

router = DefaultRouter()
router.register(r'', AdoptionRequestViewSet, basename='adoptions')

urlpatterns = [
    path('', include(router.urls)),
]
