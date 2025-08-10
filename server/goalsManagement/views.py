from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.db.models import F, ExpressionWrapper, fields

from .models import Streak
from .serializers import StreakSerializer
from projectManagement.permissions import IsOwner  # or your own IsOwner permission



class StreakViewSet(viewsets.ModelViewSet):
    queryset = Streak.objects.all()
    serializer_class = StreakSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def current(self, request):
        user = request.user
        today = timezone.now().date()

        # A current streak is one that includes today or ends yesterday (still ongoing)
        current_streak = (
            Streak.objects.filter(user=user)
            .filter(start_date__lte=today)
            .filter(end_date__gte=today - timedelta(days=1))
            .order_by('-end_date')
            .first()
        )

        if current_streak:
            data = {
                "start_date": current_streak.start_date,
                "end_date": current_streak.end_date,
                "length": current_streak.length,
            }
        else:
            data = {
                "message": "No current streak found"
            }
        return Response(data)

    @action(detail=False, methods=['get'])
    def longest(self, request):

        user = request.user
        longest_streak = (
            Streak.objects.filter(user=user)
            .annotate(
                length_days=ExpressionWrapper(
                    F('end_date') - F('start_date') + timedelta(days=1),
                    output_field=fields.DurationField()
                )
            )
            .order_by('-length_days', '-end_date')
            .first()
        )

        if longest_streak:
            data = {
                "start_date": longest_streak.start_date,
                "end_date": longest_streak.end_date,
                "length": longest_streak.length_days.days,
            }
        else:
            data = {
                "message": "No streaks found"
            }
        return Response(data)

