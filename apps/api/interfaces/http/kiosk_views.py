from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from domain.kiosk.authenticate_by_pin import InvalidPinError
from domain.kiosk.check_in import AlreadyCheckedIn, UnknownProject
from domain.kiosk.check_out import ActiveShiftNotFound
from domain.users.pin import InvalidPinFormat
from interfaces.http.container import (
    make_authenticate_by_pin_command,
    make_check_in_command,
    make_check_out_command,
    make_project_repository,
)
from interfaces.http.serializers import (
    CheckInRequestSerializer,
    CheckOutRequestSerializer,
    ErrorResponseSerializer,
    KioskAuthRequestSerializer,
    KioskAuthResponseSerializer,
    ProjectSerializer,
    ShiftSerializer,
)


def _error(code: str, message: str, status_code: int) -> Response:
    return Response(
        ErrorResponseSerializer({"code": code, "message": message}).data,
        status=status_code,
    )


class KioskAuthView(APIView):
    def post(self, request):
        serializer = KioskAuthRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            identification = make_authenticate_by_pin_command().execute(
                serializer.validated_data["pin"]
            )
        except InvalidPinFormat:
            return _error("invalid_pin_format", "PIN must be 4-6 digits", 400)
        except InvalidPinError:
            return _error("invalid_pin", "PIN not recognized", 401)
        return Response(KioskAuthResponseSerializer(identification).data)


class ListProjectsView(APIView):
    def get(self, request):
        projects = make_project_repository().find_all_active()
        return Response(ProjectSerializer(projects, many=True).data)


class CheckInView(APIView):
    def post(self, request):
        serializer = CheckInRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            shift = make_check_in_command().execute(
                volunteer_id=serializer.validated_data["volunteer_id"],
                project_id=serializer.validated_data["project_id"],
            )
        except UnknownProject:
            return _error("unknown_project", "Project not found", 400)
        except AlreadyCheckedIn:
            return _error("already_checked_in", "Volunteer already has an active shift", 409)
        return Response(ShiftSerializer(shift).data, status=status.HTTP_201_CREATED)


class CheckOutView(APIView):
    def post(self, request):
        serializer = CheckOutRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            shift = make_check_out_command().execute(
                shift_id=serializer.validated_data["shift_id"],
            )
        except ActiveShiftNotFound:
            return _error("no_active_shift", "No active shift found", 409)
        return Response(ShiftSerializer(shift).data)


