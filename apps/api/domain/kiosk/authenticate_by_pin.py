from dataclasses import dataclass

from domain.shifts.repository import ShiftRepository
from domain.shifts.shift import Shift

# from domain.users.pin_hasher import PinHasher
from domain.users.hasher import PinHasher
from domain.users.pin import Pin
from domain.users.repository import UserRepository
from domain.users.user import User


class InvalidPinError(Exception):
    """Raised when a PIN doesn't match any user."""


@dataclass(frozen=True)
class KioskIdentification:
    volunteer: User
    active_shift: Shift | None


class AuthenticateByPinCommand:
    def __init__(
        self,
        users: UserRepository,
        shifts: ShiftRepository,
        hasher: PinHasher,
    ):
        self.users = users
        self.shifts = shifts
        self.hasher = hasher

    def execute(self, raw_pin: str) -> KioskIdentification:
        pin = Pin(raw_pin)  # raises InvalidPinFormat
        pin_hash = self.hasher.hash(pin)
        user = self.users.find_by_pin_hash(pin_hash)
        if user is None:
            raise InvalidPinError()
        active_shift = self.shifts.find_active_for_volunteer(user.id)
        return KioskIdentification(volunteer=user, active_shift=active_shift)