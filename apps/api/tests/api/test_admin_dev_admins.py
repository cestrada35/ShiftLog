from uuid import uuid4

import pytest

from infrastructure.django.models import AdminModel


@pytest.fixture
def admins():
    return [
        AdminModel.objects.create(id=uuid4(), email="b@shiftlog.local", name="Bravo"),
        AdminModel.objects.create(id=uuid4(), email="a@shiftlog.local", name="Alpha"),
    ]


@pytest.mark.django_db
def test_lists_active_admins_ordered_by_name(client, admins, settings):
    settings.DEBUG = True
    response = client.get("/api/admin/dev/admins")

    assert response.status_code == 200
    body = response.json()
    assert [a["name"] for a in body] == ["Alpha", "Bravo"]


@pytest.mark.django_db
def test_returns_404_when_not_debug(client, admins, settings):
    settings.DEBUG = False
    response = client.get("/api/admin/dev/admins")
    assert response.status_code == 404


@pytest.mark.django_db
def test_excludes_inactive_admins(client, settings):
    settings.DEBUG = True
    AdminModel.objects.create(
        id=uuid4(), email="gone@shiftlog.local", name="Gone", is_active=False,
    )
    AdminModel.objects.create(id=uuid4(), email="here@shiftlog.local", name="Here")

    response = client.get("/api/admin/dev/admins")
    names = [a["name"] for a in response.json()]
    assert names == ["Here"]