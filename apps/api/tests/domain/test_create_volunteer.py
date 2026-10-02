import pytest
from uuid import uuid4

from domain.users.create_volunteer import (
    CreateVolunteerCommand,
    EmptyNameError,
    PinGenerationError,
)
from domain.users.set_volunteer_active import (
    SetVolunteerActiveCommand,
    VolunteerNotFound,
)
from domain.users.user import User

from tests.domain.fakes import (
    FakePasswordGenerator,
    FakePasswordHasher,
    FakePinGenerator,
    FakePinHasher,
    InMemoryUserRepository,
)


def make_command(users=None, pins=None):
    return CreateVolunteerCommand(
        users=users or InMemoryUserRepository(),
        pin_generator=FakePinGenerator(pins or ["1234"]),
        password_generator=FakePasswordGenerator("demo-pass-123"),
        pin_hasher=FakePinHasher(),
        password_hasher=FakePasswordHasher(),
    )


def test_creates_volunteer_with_hashed_credentials():
    users = InMemoryUserRepository()
    cmd = make_command(users=users, pins=["1234"])

    result = cmd.execute("Ada Lovelace")

    assert result.volunteer.name == "Ada Lovelace"
    assert result.volunteer.pin_hash == "hashed-pin:1234"
    assert result.volunteer.password_hash == "hashed-password:demo-pass-123"
    assert result.volunteer.is_active is True
    assert result.raw_pin == "1234"
    assert result.raw_password == "demo-pass-123"
    assert users.get_by_id(result.volunteer.id) is not None


def test_trims_whitespace_from_name():
    cmd = make_command()
    result = cmd.execute("   Ada Lovelace   ")
    assert result.volunteer.name == "Ada Lovelace"


def test_rejects_empty_name():
    cmd = make_command()
    with pytest.raises(EmptyNameError):
        cmd.execute("   ")


def test_retries_pin_on_collision():
    existing = User(
        id=uuid4(),
        name="Existing",
        pin_hash="hashed-pin:1234",
        password_hash="hashed-password:whatever",
    )
    users = InMemoryUserRepository([existing])
    cmd = make_command(users=users, pins=["1234", "5678"])

    result = cmd.execute("Ada Lovelace")

    assert result.raw_pin == "5678"
    assert result.volunteer.pin_hash == "hashed-pin:5678"


def test_gives_up_after_max_attempts():
    existing = User(
        id=uuid4(),
        name="Existing",
        pin_hash="hashed-pin:1234",
        password_hash="hashed-password:whatever",
    )
    users = InMemoryUserRepository([existing])
    cmd = CreateVolunteerCommand(
        users=users,
        pin_generator=FakePinGenerator(["1234"] * 5),
        password_generator=FakePasswordGenerator(),
        pin_hasher=FakePinHasher(),
        password_hasher=FakePasswordHasher(),
        max_pin_attempts=3,
    )

    with pytest.raises(PinGenerationError):
        cmd.execute("Ada Lovelace")


def test_set_active_toggles_state():
    cmd = make_command()
    created = cmd.execute("Ada Lovelace")
    users = InMemoryUserRepository([created.volunteer])

    toggle = SetVolunteerActiveCommand(users=users)

    updated = toggle.execute(created.volunteer.id, is_active=False)
    assert updated.is_active is False
    assert users.get_by_id(created.volunteer.id).is_active is False

    updated = toggle.execute(created.volunteer.id, is_active=True)
    assert updated.is_active is True


def test_set_active_unknown_volunteer_raises():
    toggle = SetVolunteerActiveCommand(users=InMemoryUserRepository())
    with pytest.raises(VolunteerNotFound):
        toggle.execute(uuid4(), is_active=False)