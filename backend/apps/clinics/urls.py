from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.clinics.views import ClinicViewSet

router = DefaultRouter()
router.register(r'', ClinicViewSet, basename='clinics')

urlpatterns = [
    path('', include(router.urls)),
]
