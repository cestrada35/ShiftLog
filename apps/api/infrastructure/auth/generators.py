import secrets
import string

from domain.users.password import Password
from domain.users.pin import Pin


class NumericPinGenerator:
    """Generates a 6-digit numeric PIN using a cryptographic RNG."""

    def __init__(self, length: int = 6):
        self._length = length

    def generate(self) -> Pin:
        digits = [secrets.choice(string.digits) for _ in range(self._length)]
        return Pin("".join(digits))


class RandomPasswordGenerator:
    """Generates a 12-char alphanumeric password."""

    def __init__(self, length: int = 12):
        self._length = length

    def generate(self) -> Password:
        alphabet = string.ascii_letters + string.digits
        chars = [secrets.choice(alphabet) for _ in range(self._length)]
        return Password("".join(chars))