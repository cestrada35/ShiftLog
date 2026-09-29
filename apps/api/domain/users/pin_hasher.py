from typing import Protocol

from domain.users.pin import Pin


class PinHasher(Protocol):
    def hash(self, pin: Pin) -> str: ...