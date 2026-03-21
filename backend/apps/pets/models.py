from django.conf import settings
from django.db import models


class Pet(models.Model):
    """A pet available for adoption."""

    class Status(models.TextChoices):
        AVAILABLE = 'available', 'Available'
        ADOPTED = 'adopted', 'Adopted'

    name = models.CharField(max_length=255)
    age = models.CharField(max_length=50, help_text='e.g. "2 años"')
    breed = models.CharField(max_length=100, blank=True, default='Mestiza')
    description = models.TextField(blank=True, default='')
    image = models.ImageField(upload_to='pets/', blank=True, null=True)
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.AVAILABLE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pets'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class PetInteraction(models.Model):
    """Tracks a user's like / skip interaction with a pet (Tinder-style)."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pet_interactions',
    )
    pet = models.ForeignKey(
        Pet,
        on_delete=models.CASCADE,
        related_name='interactions',
    )
    liked = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pet_interactions'
        unique_together = ('user', 'pet')
        ordering = ['-created_at']

    def __str__(self):
        action = 'liked' if self.liked else 'skipped'
        return f'{self.user.email} {action} {self.pet.name}'
