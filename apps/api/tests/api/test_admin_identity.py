import pytest
from uuid import uuid4

from infrastructure.django.models import AdminModel


@pytest.fixture
def admin():
    return AdminModel.objects.create(
        id=uuid4(),
        email="admin@shiftlog.local",
        name="Admin One",
    )


@pytest.mark.django_db
def test_whoami_without_header_returns_401(client):
    response = client.get("/api/admin/whoami")
    assert response.status_code == 401


@pytest.mark.django_db
def test_whoami_with_malformed_header_returns_401(client):
    response = client.get(
        "/api/admin/whoami",
        HTTP_X_ADMIN_ID="not-a-uuid",
    )
    assert response.status_code == 401


@pytest.mark.django_db
def test_whoami_with_unknown_admin_returns_401(client):
    response = client.get(
        "/api/admin/whoami",
        HTTP_X_ADMIN_ID=str(uuid4()),
    )
    assert response.status_code == 401


@pytest.mark.django_db
def test_whoami_with_valid_admin_returns_profile(client, admin):
    response = client.get(
        "/api/admin/whoami",
        HTTP_X_ADMIN_ID=str(admin.id),
    )
    assert response.status_code == 200
    body = response.json()
    assert body["email"] == "admin@shiftlog.local"
    assert body["name"] == "Admin One"
    assert body["id"] == str(admin.id)
