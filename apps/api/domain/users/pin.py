from dataclasses import dataclass


class InvalidPinFormat(Exception):
    pass


@dataclass(frozen=True)
class Pin:
    value: str

    def __post_init__(self):
        if not self.value.isdigit():
            raise InvalidPinFormat("PIN must contain digits only")
        if not (4 <= len(self.value) <= 6):
            raise InvalidPinFormat("PIN must be 4-6 digits")