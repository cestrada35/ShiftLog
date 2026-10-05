from datetime import timedelta

from django.utils import timezone

from infrastructure.django.models import ProjectModel, ShiftModel, UserModel


def get_dashboard_stats() -> dict:
    """
    Read model for the admin dashboard.

    This is a query, not a command. It is allowed to import the ORM directly
    because it has no domain rules to protect — it just shapes data for a view.
    See docs/adr/0004-read-models.md.
    """
    now = timezone.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    total_volunteers = UserModel.objects.count()
    active_volunteers = UserModel.objects.filter(is_active=True).count()
    total_projects = ProjectModel.objects.count()
    active_projects = ProjectModel.objects.filter(is_active=True).count()
    shifts_today = ShiftModel.objects.filter(started_at__gte=today_start).count()

    recent_rows = (
        ShiftModel.objects
        .select_related("volunteer", "project")
        .order_by("-started_at")[:5]
    )
    recent_shifts = [
        {
            "id": row.id,
            "volunteerName": row.volunteer.name,
            "projectName": row.project.name,
            "startedAt": row.started_at,
            "endedAt": row.ended_at,
        }
        for row in recent_rows
    ]

    return {
        "totalVolunteers": total_volunteers,
        "activeVolunteers": active_volunteers,
        "totalProjects": total_projects,
        "activeProjects": active_projects,
        "shiftsToday": shifts_today,
        "recentShifts": recent_shifts,
    }