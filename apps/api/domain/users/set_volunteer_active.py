from uuid import UUID

from domain.users.repository import UserRepository
from domain.users.user import User


class VolunteerNotFound(Exception):
    pass


class SetVolunteerActiveCommand:
    def __init__(self, users: UserRepository):
        self.users = users

    def execute(self, volunteer_id: UUID, is_active: bool) -> User:
        volunteer = self.users.get_by_id(volunteer_id)
        if volunteer is None:
            raise VolunteerNotFound()
        updated = volunteer.activate() if is_active else volunteer.deactivate()
        self.users.save(updated)
        return updated