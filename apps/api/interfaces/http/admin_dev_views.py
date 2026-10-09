from django.conf import settings
from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView

from infrastructure.django.models import AdminModel
from interfaces.http.serializers import AdminListItemSerializer


class DevListAdminsView(APIView):
    """
    Dev-only: list admins so the demo sign-in screen can offer a picker.

    Guarded by DEBUG. Never available in production. See ADR 0002 for the
    broader demo-only identity strategy this is part of.
    """
    permission_classes = []  # no auth required — this IS the sign-in helper

    def get(self, request):
        if not settings.DEBUG or not settings.SHIFTLOG_DEMO_MODE:
            raise Http404()

        admins = AdminModel.objects.filter(is_active=True).order_by("name")
        return Response(AdminListItemSerializer(admins, many=True).data)