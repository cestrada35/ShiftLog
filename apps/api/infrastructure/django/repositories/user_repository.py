from uuid import UUID

from domain.users.user import User
from infrastructure.django.models import UserModel


class DjangoUserRepository:
    def find_by_pin_hash(self, pin_hash: str) -> User | None:
        try:
            row = UserModel.objects.get(pin_hash=pin_hash, is_active=True)
        except UserModel.DoesNotExist:
            return None
        return self._to_domain(row)

    def get_by_id(self, user_id: UUID) -> User | None:
        try:
            row = UserModel.objects.get(id=user_id)
        except UserModel.DoesNotExist:
            return None
        return self._to_domain(row)

    def _to_domain(self, row: UserModel) -> User:
        return User(
            id=row.id,
            name=row.name,
            pin_hash=row.pin_hash,
        )