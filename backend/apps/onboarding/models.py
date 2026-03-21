from django.conf import settings
from django.db import models


class Onboarding(models.Model):
    """Stores first-time setup preferences for a user."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='onboarding',
    )
    preferences = models.JSONField(default=dict, blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'onboarding'

    def __str__(self):
        return f'Onboarding for {self.user.email}'
