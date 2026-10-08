import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def _bool(name: str, default: bool = False) -> bool:
    return os.environ.get(name, str(default)).lower() in ("1", "true", "yes")


SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-only-change-in-production")
DEBUG = _bool("DJANGO_DEBUG", default=True)
ALLOWED_HOSTS = [
    h.strip() for h in os.environ.get("DJANGO_ALLOWED_HOSTS", "*").split(",") if h.strip()
]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.auth",
    "rest_framework",
    "infrastructure.django.apps.ShiftLogDjangoConfig",
]

MIDDLEWARE = [
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "config.urls"

# - Local dev omits DJANGO_DB_ENGINE → defaults to sqlite.
# - CI and production set DJANGO_DB_ENGINE=postgres explicitly.
DB_ENGINE = os.environ.get("DJANGO_DB_ENGINE", "sqlite" if DEBUG else "postgres")

if DB_ENGINE == "sqlite":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
elif DB_ENGINE == "postgres":
    _required = ["POSTGRES_DB", "POSTGRES_USER", "POSTGRES_PASSWORD"]
    _missing = [k for k in _required if not os.environ.get(k)]
    if _missing:
        raise RuntimeError(
            f"DJANGO_DB_ENGINE=postgres requires: {', '.join(_missing)}"
        )
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ["POSTGRES_DB"],
            "USER": os.environ["POSTGRES_USER"],
            "PASSWORD": os.environ["POSTGRES_PASSWORD"],
            "HOST": os.environ.get("POSTGRES_HOST", "db"),
            "PORT": os.environ.get("POSTGRES_PORT", "5432"),
        }
    }
else:
    raise RuntimeError(f"Unknown DJANGO_DB_ENGINE: {DB_ENGINE!r}")

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PARSER_CLASSES": ["rest_framework.parsers.JSONParser"],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "interfaces.http.authentication.HeaderAdminAuthentication",
    ],
    "UNAUTHENTICATED_USER": None,
    "UNAUTHENTICATED_TOKEN": None,
}

USE_TZ = True
TIME_ZONE = "UTC"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

PIN_HASH_SECRET = os.environ.get("PIN_HASH_SECRET", "dev-only-pin-hash-secret")
SHIFTLOG_DEMO_MODE = _bool("SHIFTLOG_DEMO_MODE", default=DEBUG)