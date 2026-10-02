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

    def exists_by_pin_hash(self, pin_hash: str) -> bool:
        return UserModel.objects.filter(pin_hash=pin_hash).exists()

    def list_all(self) -> list[User]:
        rows = UserModel.objects.all().order_by("name")
        return [self._to_domain(r) for r in rows]

    def save(self, user: User) -> None:
        UserModel.objects.update_or_create(
            id=user.id,
            defaults={
                "name": user.name,
                "pin_hash": user.pin_hash,
                "password_hash": user.password_hash,
                "is_active": user.is_active,
            },
        )

    def _to_domain(self, row: UserModel) -> User:
        return User(
            id=row.id,
            name=row.name,
            pin_hash=row.pin_hash,
            password_hash=row.password_hash,
            is_active=row.is_active,
        )