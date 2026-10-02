from domain.kiosk.authenticate_by_pin import AuthenticateByPinCommand
from domain.kiosk.check_in import CheckInCommand
from domain.kiosk.check_out import CheckOutCommand
from infrastructure.auth.pin_hasher import HmacPinHasher
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