from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model with role-based access control."""

    class Role(models.TextChoices):
        USER = 'user', 'User'
        STAFF = 'staff', 'Staff'
        ADMIN = 'admin', 'Admin'

    # Remove the default 'username' field; we use email as the login identifier.
    username = None

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.USER,
    )
    is_active = models.BooleanField(default=True)
    onboarding_complete = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        db_table = 'users'
        ordering = ['-date_joined']

    def __str__(self):
        return self.email

    # --------------- convenience helpers ---------------
    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    @property
    def is_staff_user(self):
        return self.role in (self.Role.STAFF, self.Role.ADMIN)
