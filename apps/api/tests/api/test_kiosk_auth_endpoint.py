import pytest
from uuid import uuid4

from domain.users.pin import Pin
from infrastructure.auth.pin_hasher import HmacPinHasher
from infrastructure.django.models import UserModel


@pytest.fixture
def hasher():
    return HmacPinHasher(secret="test-secret")


@pytest.fixture
def seeded_user(hasher):
    pin = Pin("1234")
    return UserModel.objects.create(
        id=uuid4(),
        name="Mark S.",
        pin_hash=hasher.hash(pin),
    )


@pytest.mark.django_db
def test_valid_pin_returns_identification(client, seeded_user, settings):
    settings.PIN_HASH_SECRET = "test-secret"

    response = client.post(
        "/api/kiosk/auth",
        data={"pin": "1234"},
        content_type="application/json",
    )

    assert response.status_code == 200
    body = response.json()

    # Contract shape — camelCase per OpenAPI
    assert set(body.keys()) == {"volunteer", "activeShift"}
    assert body["volunteer"]["name"] == "Mark S."
    assert "id" in body["volunteer"]
    assert body["activeShift"] is None


@pytest.mark.django_db
def test_invalid_pin_returns_401_with_error_envelope(client, seeded_user, settings):
    settings.PIN_HASH_SECRET = "test-secret"

    response = client.post(
        "/api/kiosk/auth",
        data={"pin": "9999"},
        content_type="application/json",
    )

    assert response.status_code == 401
    body = response.json()
    assert body == {"code": "invalid_pin", "message": "PIN not recognized"}


@pytest.mark.django_db
def test_malformed_pin_returns_400(client, settings):
    settings.PIN_HASH_SECRET = "test-secret"

    response = client.post(
        "/api/kiosk/auth",
        data={"pin": "abc"},
        content_type="application/json",
    )

    assert response.status_code == 400
