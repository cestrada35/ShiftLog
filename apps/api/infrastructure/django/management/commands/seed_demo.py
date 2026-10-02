from uuid import uuid4

from django.core.management.base import BaseCommand

from domain.users.pin import Pin
from infrastructure.auth.pin_hasher import HmacPinHasher
from infrastructure.django.models import AdminModel, ProjectModel, UserModel


class Command(BaseCommand):
    help = "Seed demo data: one admin, one volunteer (PIN 1234), two projects."

    def handle(self, *args, **options):
        hasher = HmacPinHasher()

        admin, created = AdminModel.objects.get_or_create(
            email="admin@shiftlog.local",
            defaults={"id": uuid4(), "name": "Admin One"},
        )
        self.stdout.write(
            f"Admin {'created' if created else 'exists'}: {admin.name} "
            f"(id={admin.id}, email={admin.email})"
        )

        user, created = UserModel.objects.get_or_create(
            pin_hash=hasher.hash(Pin("1234")),
            defaults={"id": uuid4(), "name": "Mark S."},
        )
        self.stdout.write(f"Volunteer {'created' if created else 'exists'}: {user.name}")

        for name, description in [
            ("Community Kitchen", "Meal prep and distribution"),
            ("Garden Restoration", "Outdoor site work"),
        ]:
            project, created = ProjectModel.objects.get_or_create(
                name=name,
                defaults={"id": uuid4(), "description": description},
            )
            self.stdout.write(f"Project {'created' if created else 'exists'}: {project.name}")