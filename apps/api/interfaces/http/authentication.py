from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from infrastructure.django.repositories import DjangoAdminRepository

ADMIN_HEADER = "X-Admin-Id"


class HeaderAdminAuthentication(BaseAuthentication):
    """
    Demo-only authentication.

    Reads the admin ID from a request header and looks up the admin.
    No password, no session, no expiry. This class is the *only* place
    in the codebase that knows how admin identity is transmitted. When
    real auth is introduced, replace this class and update
    REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'].

    See docs/adr/0002-admin-identity.md.
    """

    def authenticate(self, request):
        raw = request.headers.get(ADMIN_HEADER)
        if not raw:
            # Returning None lets DRF fall through to the next
            # authentication class. If none succeed, IsAuthenticated
            # returns 401.
            return None

        try:
            from uuid import UUID
            admin_id = UUID(raw)
        except (ValueError, TypeError):
            raise AuthenticationFailed("X-Admin-Id must be a UUID")

        admin = DjangoAdminRepository().get_by_id(admin_id)
        if admin is None:
            raise AuthenticationFailed("Unknown or inactive admin")

        return (admin, None)

    def authenticate_header(self, request):
        # Returning a string makes DRF return 401 rather than 403
        # when auth fails. The string is the WWW-Authenticate value.
        return ADMIN_HEADER
