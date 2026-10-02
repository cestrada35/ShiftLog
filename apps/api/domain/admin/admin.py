from dataclasses import dataclass
from uuid import UUID


@dataclass(frozen=True)
class Admin:
    id: UUID
    email: str
    name: str

    @property
    def is_authenticated(self) -> bool:
        """
        Compatibility shim for DRF's IsAuthenticated permission.

        A domain Admin is by definition authenticated when it exists as
        a value, so this is always True. The property exists because DRF
        checks `request.user.is_authenticated`, and we want to reuse
        DRF's permission classes rather than write custom ones.
        """
        return True

