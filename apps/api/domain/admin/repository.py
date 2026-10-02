from typing import Protocol
from uuid import UUID

from domain.admin.admin import Admin


class AdminRepository(Protocol):
    def get_by_id(self, admin_id: UUID) -> Admin | None: ...
    # def get_by_email(self, email: str) -> Admin | None: ...
