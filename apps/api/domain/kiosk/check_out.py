from uuid import UUID

from domain.shifts.repository import ShiftRepository
from domain.shifts.shift import Shift
from domain.shared.clock import Clock


class ActiveShiftNotFound(Exception):
    pass


class CheckOutCommand:
    def __init__(self, shifts: ShiftRepository, clock: Clock):
        self.shifts = shifts
        self.clock = clock

    def execute(self, shift_id: UUID) -> Shift:
        shift = self.shifts.find_by_id(shift_id)
        if shift is None or not shift.is_active:
            raise ActiveShiftNotFound()
        completed = shift.check_out(self.clock.now())
        self.shifts.save(completed)
        return completed