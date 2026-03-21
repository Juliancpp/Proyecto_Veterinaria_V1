from django.contrib import admin

from apps.onboarding.models import Onboarding


@admin.register(Onboarding)
class OnboardingAdmin(admin.ModelAdmin):
    list_display = ('user', 'completed', 'created_at')
    list_filter = ('completed',)
