from uuid import UUID

from domain.admin.admin import Admin
from infrastructure.django.models import AdminModel


class DjangoAdminRepository:
    def get_by_id(self, admin_id: UUID) -> Admin | None:
        try:
            row = AdminModel.objects.get(id=admin_id, is_active=True)
        except AdminModel.DoesNotExist:
            return None
        return self._to_domain(row)

    def _to_domain(self, row: AdminModel) -> Admin:
        return Admin(id=row.id, email=row.email, name=row.name)
