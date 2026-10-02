from typing import Protocol
from uuid import UUID

from domain.projects.project import Project


class ProjectRepository(Protocol):
    def find_all_active(self) -> list[Project]: ...
    def get_by_id(self, project_id: UUID) -> Project | None: ...