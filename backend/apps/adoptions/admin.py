from django.contrib import admin

from apps.adoptions.models import AdoptionRequest


@admin.register(AdoptionRequest)
class AdoptionRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'pet', 'status', 'created_at')
    list_filter = ('status',)
    readonly_fields = ('created_at', 'updated_at')
