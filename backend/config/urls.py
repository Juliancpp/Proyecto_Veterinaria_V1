"""Root URL configuration."""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from apps.users.urls import auth_urlpatterns, users_urlpatterns

# ────────────────────────── Swagger schema ────────────────────────────────
schema_view = get_schema_view(
    openapi.Info(
        title='Veterinaria API',
        default_version='v1',
        description='REST API for the Veterinaria platform',
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

# ──────────────────────────── URL patterns ────────────────────────────────
urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API docs
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # App routes
    path('api/auth/', include((auth_urlpatterns, 'auth'))),
    path('api/users/', include((users_urlpatterns, 'users'))),
    path('api/pets/', include('apps.pets.urls')),
    path('api/reports/', include('apps.reports.urls')),
    path('api/clinics/', include('apps.clinics.urls')),
    path('api/onboarding/', include('apps.onboarding.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
