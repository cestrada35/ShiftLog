from django.apps import AppConfig


class ShiftLogDjangoConfig(AppConfig):
    name = "infrastructure.django"
    label = "shiftlog"
    default_auto_field = "django.db.models.BigAutoField"
