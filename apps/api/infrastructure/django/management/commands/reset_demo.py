from django.core.management import call_command
from django.core.management.base import BaseCommand

from infrastructure.django.models import ProjectModel, ShiftModel, UserModel


class Command(BaseCommand):
    help = "Wipe all demo data and reseed."

    def handle(self, *args, **options):
        ShiftModel.objects.all().delete()
        ProjectModel.objects.all().delete()
        UserModel.objects.all().delete()
        self.stdout.write(self.style.WARNING("Demo data wiped."))
        call_command("seed_demo")
