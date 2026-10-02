from dataclasses import dataclass
from uuid import uuid4

from domain.users.generator import PasswordGenerator, PinGenerator
from domain.users.hasher import PasswordHasher, PinHasher
from domain.users.repository import UserRepository
from domain.users.user import User


class EmptyNameError(Exception):
    pass


class PinGenerationError(Exception):
    """Raised when we can't find a unique PIN after many attempts."""


@dataclass(frozen=True)
class CreateVolunteerResult:
    volunteer: User
    raw_pin: str
    raw_password: str


class CreateVolunteerCommand:
    def __init__(
        self,
        users: UserRepository,
        pin_generator: PinGenerator,
        password_generator: PasswordGenerator,
        pin_hasher: PinHasher,
        password_hasher: PasswordHasher,
        max_pin_attempts: int = 100,
    ):
        self.users = users
        self.pin_generator = pin_generator
        self.password_generator = password_generator
        self.pin_hasher = pin_hasher
        self.password_hasher = password_hasher
        self.max_pin_attempts = max_pin_attempts

    def execute(self, name: str) -> CreateVolunteerResult:
        cleaned_name = name.strip()
        if not cleaned_name:
            raise EmptyNameError()

        pin, pin_hash = self._generate_unique_pin()
        password = self.password_generator.generate()
        password_hash = self.password_hasher.hash(password)

        volunteer = User(
            id=uuid4(),
            name=cleaned_name,
            pin_hash=pin_hash,
            password_hash=password_hash,
            is_active=True,
        )
        self.users.save(volunteer)

        return CreateVolunteerResult(
            volunteer=volunteer,
            raw_pin=pin.value,
            raw_password=password.value,
        )

    def _generate_unique_pin(self):
        for _ in range(self.max_pin_attempts):
            pin = self.pin_generator.generate()
            pin_hash = self.pin_hasher.hash(pin)
            if not self.users.exists_by_pin_hash(pin_hash):
                return pin, pin_hash
        raise PinGenerationError(
            f"Could not generate a unique PIN after {self.max_pin_attempts} attempts"
        )