from dataclasses import dataclass
from uuid import UUID


@dataclass(frozen=True)
class Project:
    id: UUID
    name: str
    description: str