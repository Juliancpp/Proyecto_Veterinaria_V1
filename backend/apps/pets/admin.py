from django.contrib import admin

from apps.pets.models import Pet, PetInteraction


@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ('name', 'age', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('name', 'description')


@admin.register(PetInteraction)
class PetInteractionAdmin(admin.ModelAdmin):
    list_display = ('user', 'pet', 'liked', 'created_at')
    list_filter = ('liked',)
