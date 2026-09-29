from uuid import UUID

from domain.shifts.shift import Shift
from infrastructure.django.models import ShiftModel


class DjangoShiftRepository:
    def save(self, shift: Shift) -> None:
        ShiftModel.objects.update_or_create(
            id=shift.id,
            defaults={
                "volunteer_id": shift.volunteer_id,
                "project_id": shift.project_id,
                "started_at": shift.started_at,
                "ended_at": shift.ended_at,
            },
        )

    def find_active_for_volunteer(self, volunteer_id: UUID) -> Shift | None:
        row = (
            ShiftModel.objects
            .filter(volunteer_id=volunteer_id, ended_at__isnull=True)
            .first()
        )
        return self._to_domain(row) if row else None

    def _to_domain(self, row: ShiftModel) -> Shift:
        return Shift(
            id=row.id,
            volunteer_id=row.volunteer_id,
            project_id=row.project_id,
            started_at=row.started_at,
            ended_at=row.ended_at,
        )