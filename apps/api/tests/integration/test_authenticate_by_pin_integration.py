import pytest
from uuid import uuid4

from django.utils import timezone

from domain.kiosk.authenticate_by_pin import (
    AuthenticateByPinCommand,
    InvalidPinError,
)
from infrastructure.auth.pin_hasher import HmacPinHasher
from infrastructure.django.models import UserModel, ShiftModel
from infrastructure.django.repositories import (
    DjangoUserRepository,
    DjangoShiftRepository,
)


@pytest.fixture
def hasher():
    return HmacPinHasher(secret="test-secret")


@pytest.fixture
def seed_user(hasher):
    from domain.users.pin import Pin
    pin = Pin("1234")
    user = UserModel.objects.create(
        id=uuid4(),
        name="Ada Lovelace",
        pin_hash=hasher.hash(pin),
    )
    return user


@pytest.mark.django_db
def test_authenticate_against_real_database(seed_user, hasher):
    command = AuthenticateByPinCommand(
        users=DjangoUserRepository(),
        shifts=DjangoShiftRepository(),
        hasher=hasher,
    )

    result = command.execute("1234")

    assert result.volunteer.name == "Ada Lovelace"
    assert result.active_shift is None


@pytest.mark.django_db
def test_unknown_pin_against_real_database(hasher):
    command = AuthenticateByPinCommand(
        users=DjangoUserRepository(),
        shifts=DjangoShiftRepository(),
        hasher=hasher,
    )

    with pytest.raises(InvalidPinError):
        command.execute("9999")


@pytest.fixture
def seed_project():
    from infrastructure.django.models import ProjectModel
    return ProjectModel.objects.create(id=uuid4(), name="Kitchen")


@pytest.mark.django_db
def test_active_shift_is_found_in_database(seed_user, seed_project, hasher):
    ShiftModel.objects.create(
        id=uuid4(),
        volunteer_id=seed_user.id,
        project_id=seed_project.id,
        started_at=timezone.now(),
    )

    command = AuthenticateByPinCommand(
        users=DjangoUserRepository(),
        shifts=DjangoShiftRepository(),
        hasher=hasher,
    )
    result = command.execute("1234")

    assert result.active_shift is not None
