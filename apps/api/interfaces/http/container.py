from domain.kiosk.authenticate_by_pin import AuthenticateByPinCommand
from domain.kiosk.check_in import CheckInCommand
from domain.kiosk.check_out import CheckOutCommand
from domain.users.create_volunteer import CreateVolunteerCommand
from domain.users.set_volunteer_active import SetVolunteerActiveCommand
from infrastructure.auth.generators import NumericPinGenerator, RandomPasswordGenerator
from infrastructure.auth.pin_hasher import HmacPasswordHasher, HmacPinHasher
from infrastructure.clock import SystemClock
from infrastructure.django.repositories import (
    DjangoProjectRepository,
    DjangoShiftRepository,
    DjangoUserRepository,
)


def make_authenticate_by_pin_command() -> AuthenticateByPinCommand:
    return AuthenticateByPinCommand(
        users=DjangoUserRepository(),
        shifts=DjangoShiftRepository(),
        hasher=HmacPinHasher(),
    )


def make_check_in_command() -> CheckInCommand:
    return CheckInCommand(
        shifts=DjangoShiftRepository(),
        projects=DjangoProjectRepository(),
        clock=SystemClock(),
    )


def make_check_out_command() -> CheckOutCommand:
    return CheckOutCommand(
        shifts=DjangoShiftRepository(),
        clock=SystemClock(),
    )


def make_project_repository() -> DjangoProjectRepository:
    return DjangoProjectRepository()

def make_create_volunteer_command() -> CreateVolunteerCommand:
    return CreateVolunteerCommand(
        users=DjangoUserRepository(),
        pin_generator=NumericPinGenerator(),
        password_generator=RandomPasswordGenerator(),
        pin_hasher=HmacPinHasher(),
        password_hasher=HmacPasswordHasher(),
    )


def make_set_volunteer_active_command() -> SetVolunteerActiveCommand:
    return SetVolunteerActiveCommand(users=DjangoUserRepository())


def make_user_repository() -> DjangoUserRepository:
    return DjangoUserRepository()