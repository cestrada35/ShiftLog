from dataclasses import dataclass


class InvalidPasswordFormat(Exception):
    pass


@dataclass(frozen=True)
class Password:
    value: str

    def __post_init__(self):
        if len(self.value) < 8:
            raise InvalidPasswordFormat("Password must be at least 8 characters")
