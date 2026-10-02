from typing import Protocol

from domain.users.password import Password
from domain.users.pin import Pin


class PinGenerator(Protocol):
    def generate(self) -> Pin: ...


class PasswordGenerator(Protocol):
    def generate(self) -> Password: ...
