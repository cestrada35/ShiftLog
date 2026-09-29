from typing import Protocol
from uuid import UUID

from domain.shifts.shift import Shift


class ShiftRepository(Protocol):
    def save(self, shift: Shift) -> None: ...
    def find_active_for_volunteer(self, volunteer_id: UUID) -> Shift | None: ...