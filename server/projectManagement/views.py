from rest_framework import viewsets, permissions
from .models import Project, Log
from .serializers import ProjectSerializer, LogSerializer
from .permissions import IsOwner
from goalsManagement.models import Streak  # import the streak model
from datetime import timedelta
from django.utils import timezone
from django.db.models import Max, Q



class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        user = self.request.user
        print("User making request:", user)
        status_filter = self.request.query_params.get('status')
        print("Status filter received:", status_filter)


        cutoff_date = timezone.now().date() - timedelta(days=30)

        # --- Auto-move WIPs -> Graveyard ---
        projects_to_graveyard = Project.objects.filter(user=user, status='wips').annotate(
            last_log_date=Max('logs__date')
        ).filter(
            Q(start_date__lt=cutoff_date) |
            Q(last_log_date__lt=cutoff_date) |
            Q(last_log_date__isnull=True)
        )

        if projects_to_graveyard.exists():
            print(f"Auto-moving {projects_to_graveyard.count()} projects to graveyard")
            projects_to_graveyard.update(status='graveyard')

        # --- Auto-move Graveyard -> WIPs ---
        projects_to_wips = Project.objects.filter(user=user, status='graveyard').annotate(
            last_log_date=Max('logs__date')
        ).filter(
            Q(start_date__gte=cutoff_date) |
            Q(last_log_date__gte=cutoff_date)
        )

        if projects_to_wips.exists():
            print(f"Reviving {projects_to_wips.count()} graveyard projects to WIPs")
            projects_to_wips.update(status='wips')

        # --- Apply status filter if provided ---
        queryset = self.queryset.filter(user=user)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset


class LogViewSet(viewsets.ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        log = serializer.save(user=user)
        log_date = log.date
        one_day = timedelta(days=1)

        # Find streaks adjacent to this log_date
        streak_before = Streak.objects.filter(user=user, end_date=log_date - one_day).first()
        streak_after = Streak.objects.filter(user=user, start_date=log_date + one_day).first()

        if streak_before and streak_after:
            # Merge two streaks with log_date bridging them
            streak_before.end_date = streak_after.end_date
            streak_before.save()
            streak_after.delete()
        elif streak_before:
            # Extend streak before forward
            streak_before.end_date = max(streak_before.end_date, log_date)
            streak_before.save()
        elif streak_after:
            # Extend streak after backward
            streak_after.start_date = min(streak_after.start_date, log_date)
            streak_after.save()
        else:
            # No adjacent streaks, create new
            Streak.objects.create(user=user, start_date=log_date, end_date=log_date)
