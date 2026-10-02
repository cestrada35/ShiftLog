from uuid import UUID

from domain.projects.project import Project
from infrastructure.django.models import ProjectModel


class DjangoProjectRepository:
    def find_all_active(self) -> list[Project]:
        rows = ProjectModel.objects.filter(is_active=True).order_by("name")
        return [self._to_domain(r) for r in rows]

    def get_by_id(self, project_id: UUID) -> Project | None:
        try:
            row = ProjectModel.objects.get(id=project_id, is_active=True)
        except ProjectModel.DoesNotExist:
            return None
        return self._to_domain(row)

    def _to_domain(self, row: ProjectModel) -> Project:
        return Project(id=row.id, name=row.name, description=row.description)