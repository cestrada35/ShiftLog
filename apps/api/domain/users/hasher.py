from typing import Protocol

from domain.users.password import Password
from domain.users.pin import Pin


class PinHasher(Protocol):
    def hash(self, pin: Pin) -> str: ...


class PasswordHasher(Protocol):
    def hash(self, password: Password) -> str: ...
