import hashlib
import hmac

from django.conf import settings

from domain.users.pin import Pin


class HmacPinHasher:
    """
    Hashes a PIN using HMAC-SHA256 with a server-side secret (pepper).

    Note: PINs are inherently low-entropy (4-6 digits). This is a
    demo-grade hasher. For production, use a slow KDF (Argon2, bcrypt)
    and rate-limit failures. The domain doesn't care which — it only
    knows the PinHasher port.
    """

    def __init__(self, secret: str | None = None):
        self._secret = (secret or settings.PIN_HASH_SECRET).encode()

    def hash(self, pin: Pin) -> str:
        return hmac.new(self._secret, pin.value.encode(), hashlib.sha256).hexdigest()