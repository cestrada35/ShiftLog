from dataclasses import dataclass, replace
from datetime import datetime
from uuid import UUID, uuid4


@dataclass(frozen=True)
class Shift:
    id: UUID
    volunteer_id: UUID
    project_id: UUID
    started_at: datetime
    ended_at: datetime | None

    @classmethod
    def check_in(cls, volunteer_id: UUID, project_id: UUID, now: datetime) -> "Shift":
        return cls(
            id=uuid4(),
            volunteer_id=volunteer_id,
            project_id=project_id,
            started_at=now,
            ended_at=None,
        )

    @property
    def is_active(self) -> bool:
        return self.ended_at is None

    def check_out(self, now: datetime) -> "Shift":
        if not self.is_active:
            raise ShiftAlreadyCompleted(shift_id=self.id)
        return replace(self, ended_at=now)


class ShiftAlreadyCompleted(Exception):
    def __init__(self, shift_id: UUID):
        super().__init__(f"Shift {shift_id} is already completed")
        self.shift_id = shift_id