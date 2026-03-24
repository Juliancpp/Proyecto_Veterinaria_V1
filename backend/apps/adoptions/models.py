from django.conf import settings
from django.db import models


class AdoptionRequest(models.Model):
    """Tracks a user's formal adoption request for a pet."""

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pendiente'
        APPROVED = 'approved', 'Aprobado'
        REJECTED = 'rejected', 'Rechazado'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='adoption_requests',
    )
    pet = models.ForeignKey(
        'pets.Pet',
        on_delete=models.CASCADE,
        related_name='adoption_requests',
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'adoption_requests'
        unique_together = ('user', 'pet')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.email} → {self.pet.name} ({self.status})'
