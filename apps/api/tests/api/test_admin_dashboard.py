from uuid import uuid4

import pytest
from django.utils import timezone

from infrastructure.django.models import AdminModel, ProjectModel, ShiftModel, UserModel


@pytest.fixture
def admin():
    return AdminModel.objects.create(
        id=uuid4(), email="admin@shiftlog.local", name="Admin One",
    )


@pytest.fixture
def volunteer():
    return UserModel.objects.create(
        id=uuid4(), name="Mark S.",
        pin_hash="h1", password_hash="h2",
    )


@pytest.fixture
def project():
    return ProjectModel.objects.create(id=uuid4(), name="Kitchen")


@pytest.mark.django_db
def test_dashboard_stats_counts(client, admin, volunteer, project):
    ShiftModel.objects.create(
        id=uuid4(), volunteer_id=volunteer.id, project_id=project.id,
        started_at=timezone.now(),
    )

    response = client.get(
        "/api/admin/dashboard/stats",
        HTTP_X_ADMIN_ID=str(admin.id),
    )

    assert response.status_code == 200
    body = response.json()
    assert body["totalVolunteers"] == 1
    assert body["activeVolunteers"] == 1
    assert body["totalProjects"] == 1
    assert body["activeProjects"] == 1
    assert body["shiftsToday"] == 1
    assert len(body["recentShifts"]) == 1
    assert body["recentShifts"][0]["volunteerName"] == "Mark S."
    assert body["recentShifts"][0]["projectName"] == "Kitchen"


@pytest.mark.django_db
def test_dashboard_stats_requires_admin(client):
    response = client.get("/api/admin/dashboard/stats")
    assert response.status_code == 401


@pytest.mark.django_db
def test_dashboard_stats_empty_database(client, admin):
    response = client.get(
        "/api/admin/dashboard/stats",
        HTTP_X_ADMIN_ID=str(admin.id),
    )
    assert response.status_code == 200
    body = response.json()
    assert body["totalVolunteers"] == 0
    assert body["recentShifts"] == []