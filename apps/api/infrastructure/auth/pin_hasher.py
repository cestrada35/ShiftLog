import hashlib
import hmac

from django.conf import settings

from domain.users.password import Password
from domain.users.pin import Pin


class HmacPinHasher:
    """Demo-grade hasher. See note in ADR 0002."""

    def __init__(self, secret: str | None = None):
        self._secret = (secret or settings.PIN_HASH_SECRET).encode()

    def hash(self, pin: Pin) -> str:
        # Domain-separated: "pin:" prefix keeps PIN hashes from colliding
        # with password hashes of the same underlying value.
        payload = f"pin:{pin.value}".encode()
        return hmac.new(self._secret, payload, hashlib.sha256).hexdigest()


class HmacPasswordHasher:
    def __init__(self, secret: str | None = None):
        self._secret = (secret or settings.PIN_HASH_SECRET).encode()

    def hash(self, password: Password) -> str:
        payload = f"password:{password.value}".encode()
        return hmac.new(self._secret, payload, hashlib.sha256).hexdigest()