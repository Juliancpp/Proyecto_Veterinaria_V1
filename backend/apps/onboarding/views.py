from django.contrib.auth import get_user_model
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.onboarding.models import Onboarding
from apps.onboarding.serializers import OnboardingSerializer
from apps.users.permissions import IsAdmin

User = get_user_model()


# ──────────────────────────── Scoring engine ────────────────────────────
#
# Each of the 15 multiple-choice questions is scored 0-3.
# The "best" responsible-adopter answer gets 3, the worst gets 0.
# Maximum possible MC score = 15 × 3 = 45.
# Open-ended answers (q16-q20) get 1 bonus point each if ≥ 20 chars.
# Maximum total = 45 + 5 = 50.

SCORING_RULES: dict[str, dict[str, int]] = {
    # Q1 – Tiempo dedicado a jugar / pasear
    'q1_tiempo_juego':     {'a': 0, 'b': 2, 'c': 3, 'd': 1},
    # Q2 – Reacción si orina / defeca en casa
    'q2_accidente_casa':   {'a': 0, 'b': 0, 'c': 3, 'd': 0},
    # Q3 – Cerramiento / seguridad vivienda
    'q3_cerramiento':      {'a': 3, 'b': 3, 'c': 1, 'd': 0},
    # Q4 – Alimentación
    'q4_alimentacion':     {'a': 0, 'b': 1, 'c': 3, 'd': 1},
    # Q5 – Seguimiento / visitas
    'q5_seguimiento':      {'a': 3, 'b': 2, 'c': 0, 'd': 1},
    # Q6 – Experiencia previa
    'q6_experiencia':      {'a': 1, 'b': 1, 'c': 3, 'd': 0},
    # Q7 – Tiempo sola en casa
    'q7_tiempo_sola':      {'a': 3, 'b': 2, 'c': 0, 'd': 1},
    # Q8 – Presupuesto mensual
    'q8_presupuesto':      {'a': 0, 'b': 1, 'c': 3, 'd': 0},
    # Q9 – Problema de comportamiento
    'q9_comportamiento':   {'a': 0, 'b': 0, 'c': 3, 'd': 0},
    # Q10 – Dónde pasará el tiempo
    'q10_lugar':           {'a': 3, 'b': 2, 'c': 1, 'd': 0},
    # Q11 – Vacaciones
    'q11_vacaciones':      {'a': 0, 'b': 3, 'c': 0, 'd': 1},
    # Q12 – Esterilización
    'q12_esterilizacion':  {'a': 3, 'b': 1, 'c': 0, 'd': 0},
    # Q13 – Actividad física del hogar
    'q13_actividad_fisica': {'a': 3, 'b': 2, 'c': 1, 'd': 0},
    # Q14 – Familia de acuerdo
    'q14_familia_acuerdo': {'a': 3, 'b': 1, 'c': 0, 'd': 2},
    # Q15 – Alergia repentina
    'q15_alergia':         {'a': 3, 'b': 1, 'c': 0, 'd': 0},
}

OPEN_KEYS = [
    'q16_cirugia_emergencia',
    'q17_mudanza',
    'q18_responsable',
    'q19_bebe_pareja',
    'q20_devolver',
]


def compute_score(answers: dict) -> int:
    """Score the 20-question adoption questionnaire. Max = 50."""
    score = 0
    for key, rules in SCORING_RULES.items():
        answer = answers.get(key, '')
        score += rules.get(answer, 0)
    # Bonus for thoughtful open-ended answers (1 pt each if ≥ 20 chars)
    for key in OPEN_KEYS:
        if len(str(answers.get(key, ''))) >= 20:
            score += 1
    return score


def score_label(score: int) -> str:
    """Human-readable label for the adopter score.  Max = 50."""
    if score >= 40:
        return 'Excelente'
    elif score >= 30:
        return 'Bueno'
    elif score >= 20:
        return 'Regular'
    return 'Riesgoso'


# ──────────────────────────── ViewSet ───────────────────────────────────

class OnboardingViewSet(viewsets.ModelViewSet):
    """
    Manage onboarding for the authenticated user.

    - POST  /api/onboarding/  → create or update (upsert) answers
    - GET   /api/onboarding/  → retrieve own data
    - PATCH /api/onboarding/{id}/ → partial update
    """

    serializer_class = OnboardingSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        if user.role in ('staff', 'admin'):
            return Onboarding.objects.select_related('user').all()
        return Onboarding.objects.filter(user=user)

    # ─── Role guard: only regular users submit onboarding ──────────────

    def _reject_non_users(self, request):
        """Return a 403 Response if the caller is not a regular user, else None."""
        if request.user.role != 'user':
            return Response(
                {'detail': 'Onboarding not required for this role.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return None

    # ─── POST: upsert via update_or_create ───────────────────────────────

    def create(self, request, *args, **kwargs):
        """
        POST /api/onboarding/
        Uses update_or_create so a second POST never triggers an
        IntegrityError on the OneToOne(user) constraint.
        Only regular users may create/update their own onboarding.
        """
        blocked = self._reject_non_users(request)
        if blocked:
            return blocked

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        answers = serializer.validated_data.get('answers', {})
        preferences = serializer.validated_data.get('preferences', {})
        completed = serializer.validated_data.get('completed', False)
        score = compute_score(answers)

        instance, created = Onboarding.objects.update_or_create(
            user=request.user,
            defaults={
                'preferences': preferences,
                'answers': answers,
                'score': score,
                'completed': completed,
            },
        )

        # Sync the user flag
        if instance.completed and not request.user.onboarding_complete:
            request.user.onboarding_complete = True
            request.user.save(update_fields=['onboarding_complete'])

        resp_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(
            OnboardingSerializer(instance).data,
            status=resp_status,
        )

    # ─── PATCH: partial update ───────────────────────────────────────────

    def partial_update(self, request, *args, **kwargs):
        blocked = self._reject_non_users(request)
        if blocked:
            return blocked
        return super().partial_update(request, *args, **kwargs)

    def perform_update(self, serializer):
        answers = serializer.validated_data.get('answers', serializer.instance.answers)
        score = compute_score(answers)
        instance = serializer.save(score=score)
        if instance.completed and not self.request.user.onboarding_complete:
            self.request.user.onboarding_complete = True
            self.request.user.save(update_fields=['onboarding_complete'])

    # ─── GET list ────────────────────────────────────────────────────────

    def list(self, request, *args, **kwargs):
        """Return the single onboarding object for the current user (or 404)."""
        if request.user.role in ('staff', 'admin'):
            qs = self.get_queryset()
            serializer = OnboardingSerializer(qs, many=True)
            return Response(serializer.data)
        try:
            instance = Onboarding.objects.get(user=request.user)
        except Onboarding.DoesNotExist:
            return Response(
                {'detail': 'Onboarding not started.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(OnboardingSerializer(instance).data)

    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[0-9]+)',
            permission_classes=[permissions.IsAuthenticated, IsAdmin])
    def by_user(self, request, user_id=None):
        """GET /api/onboarding/user/{user_id}/ — Admin view of a specific user's onboarding."""
        try:
            instance = Onboarding.objects.get(user_id=user_id)
        except Onboarding.DoesNotExist:
            return Response(
                {'detail': 'No onboarding data for this user.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(OnboardingSerializer(instance).data)
