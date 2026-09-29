from typing import Protocol
from uuid import UUID

from domain.users.user import User


class UserRepository(Protocol):
    def find_by_pin_hash(self, pin_hash: str) -> User | None: ...
    def get_by_id(self, user_id: UUID) -> User | None: ...