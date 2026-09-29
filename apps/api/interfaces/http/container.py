from domain.kiosk.authenticate_by_pin import AuthenticateByPinCommand
from infrastructure.auth.pin_hasher import HmacPinHasher
from infrastructure.django.repositories import (
    DjangoShiftRepository,
    DjangoUserRepository,
)


def make_authenticate_by_pin_command() -> AuthenticateByPinCommand:
    return AuthenticateByPinCommand(
        users=DjangoUserRepository(),
        shifts=DjangoShiftRepository(),
        hasher=HmacPinHasher(),
    )
