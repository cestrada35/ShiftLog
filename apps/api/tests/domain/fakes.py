from uuid import UUID

from domain.shifts.shift import Shift
from domain.users.pin import Pin
from domain.users.user import User


class FakePinHasher:
    def hash(self, pin: Pin) -> str:
        return f"hashed:{pin.value}"


class InMemoryUserRepository:
    def __init__(self, users: list[User] | None = None):
        users = users or []
        self._by_id = {u.id: u for u in users}
        self._by_pin_hash = {u.pin_hash: u for u in users}

    def find_by_pin_hash(self, pin_hash: str) -> User | None:
        return self._by_pin_hash.get(pin_hash)

    def get_by_id(self, user_id: UUID) -> User | None:
        return self._by_id.get(user_id)


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