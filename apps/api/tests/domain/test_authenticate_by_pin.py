from datetime import datetime, timezone
from uuid import uuid4

import pytest

from domain.kiosk.authenticate_by_pin import (
    AuthenticateByPinCommand,
    InvalidPinError,
)
from domain.shifts.shift import Shift
from domain.users.pin import InvalidPinFormat
from domain.users.user import User

from tests.domain.fakes import (
    FakePinHasher,
    InMemoryShiftRepository,
    InMemoryUserRepository,
)


def make_command(users=None, shifts=None):
    return AuthenticateByPinCommand(
        users=users or InMemoryUserRepository(),
        shifts=shifts or InMemoryShiftRepository(),
        hasher=FakePinHasher(),
    )


def make_user(pin: str = "1234", name: str = "Mark S.") -> User:
    return User(
        id=uuid4(),
        name=name,
        pin_hash=f"hashed:{pin}",
    )


def test_valid_pin_returns_identification():
    user = make_user()
    cmd = make_command(users=InMemoryUserRepository([user]))

    result = cmd.execute("1234")

    assert result.volunteer.id == user.id
    assert result.volunteer.name == "Mark S."
    assert result.active_shift is None


def test_unknown_pin_raises_invalid_pin():
    cmd = make_command()

    with pytest.raises(InvalidPinError):
        cmd.execute("9999")


def test_malformed_pin_raises_format_error():
    cmd = make_command()

    with pytest.raises(InvalidPinFormat):
        cmd.execute("abc")


def test_active_shift_is_included_in_identification():
    user = make_user()
    shifts = InMemoryShiftRepository()
    active = Shift.check_in(
        volunteer_id=user.id,
        project_id=uuid4(),
        now=datetime(2026, 1, 1, 9, 0, tzinfo=timezone.utc),
    )
    shifts.save(active)

    cmd = make_command(users=InMemoryUserRepository([user]), shifts=shifts)
    result = cmd.execute("1234")

    assert result.active_shift is not None
    assert result.active_shift.id == active.id


def test_completed_shift_is_not_returned_as_active():
    user = make_user()
    shifts = InMemoryShiftRepository()
    started = datetime(2026, 1, 1, 9, 0, tzinfo=timezone.utc)
    ended = datetime(2026, 1, 1, 13, 0, tzinfo=timezone.utc)
    completed = Shift.check_in(user.id, uuid4(), started).check_out(ended)
    shifts.save(completed)

    cmd = make_command(users=InMemoryUserRepository([user]), shifts=shifts)
    result = cmd.execute("1234")

    assert result.active_shift is None