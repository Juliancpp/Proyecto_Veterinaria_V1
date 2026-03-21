from django.contrib import admin

from apps.clinics.models import Clinic


@admin.register(Clinic)
class ClinicAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'phone', 'latitude', 'longitude')
    search_fields = ('name', 'address')
