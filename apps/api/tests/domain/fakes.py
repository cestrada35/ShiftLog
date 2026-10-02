from uuid import UUID

from domain.shifts.shift import Shift
from domain.users.pin import Pin
from domain.users.user import User
from domain.users.password import Password


class FakePinHasher:
    def hash(self, pin: Pin) -> str:
        return f"hashed:{pin.value}"

class FakePinGenerator:
    """Returns PINs from a queue. Raises if exhausted."""
    def __init__(self, pins: list[str]):
        self._pins = list(pins)

    def generate(self) -> Pin:
        if not self._pins:
            raise RuntimeError("FakePinGenerator queue exhausted")
        return Pin(self._pins.pop(0))


class FakePasswordGenerator:
    def __init__(self, password: str = "demo-pass-123"):
        self._password = password

    def generate(self) -> Password:
        return Password(self._password)


class FakePinHasher:
    def hash(self, pin: Pin) -> str:
        return f"hashed-pin:{pin.value}"


class FakePasswordHasher:
    def hash(self, password: Password) -> str:
        return f"hashed-password:{password.value}"


class InMemoryUserRepository:
    def __init__(self, users: list[User] | None = None):
        self._users: dict[UUID, User] = {u.id: u for u in (users or [])}

    def find_by_pin_hash(self, pin_hash: str) -> User | None:
        for u in self._users.values():
            if u.pin_hash == pin_hash and u.is_active:
                return u
        return None

    def get_by_id(self, user_id: UUID) -> User | None:
        return self._users.get(user_id)

    def exists_by_pin_hash(self, pin_hash: str) -> bool:
        return any(u.pin_hash == pin_hash for u in self._users.values())

    def list_all(self) -> list[User]:
        return list(self._users.values())

    def save(self, user: User) -> None:
        self._users[user.id] = user


class InMemoryShiftRepository:
    def __init__(self):
        self._shifts: dict[UUID, Shift] = {}

    def save(self, shift: Shift) -> None:
        self._shifts[shift.id] = shift

    def find_active_for_volunteer(self, volunteer_id: UUID) -> Shift | None:
        for shift in self._shifts.values():
            if shift.volunteer_id == volunteer_id and shift.is_active:
                return shift
        return None