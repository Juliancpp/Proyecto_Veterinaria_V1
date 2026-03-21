from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.pets.views import PetViewSet

router = DefaultRouter()
router.register(r'', PetViewSet, basename='pets')

urlpatterns = [
    path('', include(router.urls)),
]
