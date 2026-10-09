from uuid import UUID

from domain.shared.clock import Clock
from domain.shifts.repository import ShiftRepository
from domain.shifts.shift import Shift


class AlreadyCheckedIn(Exception):
    pass


class UnknownProject(Exception):
    pass


class CheckInCommand:
    def __init__(self, shifts: ShiftRepository, projects, clock: Clock):
        self.shifts = shifts
        self.projects = projects
        self.clock = clock

    def execute(self, volunteer_id: UUID, project_id: UUID) -> Shift:
        if self.projects.get_by_id(project_id) is None:
            raise UnknownProject()
        if self.shifts.find_active_for_volunteer(volunteer_id):
            raise AlreadyCheckedIn()
        shift = Shift.check_in(volunteer_id, project_id, self.clock.now())
        self.shifts.save(shift)
        return shift