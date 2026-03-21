from apps.pets.models import PetInteraction


class PetService:
    """Business logic for pet interactions."""

    @staticmethod
    def interact(user, pet, liked: bool) -> PetInteraction:
        """Record a like or skip; update if the user already interacted."""
        interaction, _ = PetInteraction.objects.update_or_create(
            user=user,
            pet=pet,
            defaults={'liked': liked},
        )
        return interaction
