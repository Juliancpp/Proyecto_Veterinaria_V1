from django.contrib.auth import get_user_model

User = get_user_model()


class UserService:
    """Encapsulates business logic for user operations."""

    @staticmethod
    def create_user(email: str, password: str, name: str, **extra_fields) -> 'User':
        """Create and return a new user with a properly hashed password."""
        user = User(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.full_clean()
        user.save()
        return user
