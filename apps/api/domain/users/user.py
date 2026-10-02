from dataclasses import dataclass
from uuid import UUID


@dataclass(frozen=True)
class User:
    id: UUID
    name: str
    pin_hash: str
    password_hash: str
    is_active: bool = True

    def deactivate(self) -> "User":
        from dataclasses import replace
        return replace(self, is_active=False)

    def activate(self) -> "User":
        from dataclasses import replace
        return replace(self, is_active=True)