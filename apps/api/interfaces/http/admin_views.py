from uuid import UUID

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from domain.users.create_volunteer import EmptyNameError
from domain.users.set_volunteer_active import VolunteerNotFound
from interfaces.http.container import (
    make_create_volunteer_command,
    make_set_volunteer_active_command,
    make_user_repository,
)
from interfaces.http.serializers import (
    AdminSerializer,
    CreateVolunteerRequestSerializer,
    ErrorResponseSerializer,
    UpdateVolunteerRequestSerializer,
    VolunteerSerializer,
)


def _error(code: str, message: str, status_code: int) -> Response:
    return Response(
        ErrorResponseSerializer({"code": code, "message": message}).data,
        status=status_code,
    )


class AdminWhoAmIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(AdminSerializer(request.user).data)


class VolunteerListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        volunteers = make_user_repository().list_all()
        return Response(VolunteerSerializer(volunteers, many=True).data)

    def post(self, request):
        serializer = CreateVolunteerRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            result = make_create_volunteer_command().execute(
                name=serializer.validated_data["name"],
            )
        except EmptyNameError:
            return _error("empty_name", "Name cannot be empty", 400)

        return Response(
            {
                "volunteer": VolunteerSerializer(result.volunteer).data,
                "pin": result.raw_pin,
                "password": result.raw_password,
            },
            status=status.HTTP_201_CREATED,
        )


class VolunteerDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, volunteer_id: UUID):
        serializer = UpdateVolunteerRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        users = make_user_repository()
        volunteer = users.get_by_id(volunteer_id)
        if volunteer is None:
            return _error("not_found", "Volunteer not found", 404)

        if "name" in data:
            from dataclasses import replace
            volunteer = replace(volunteer, name=data["name"].strip())
            users.save(volunteer)

        if "is_active" in data:
            try:
                volunteer = make_set_volunteer_active_command().execute(
                    volunteer_id=volunteer_id,
                    is_active=data["is_active"],
                )
            except VolunteerNotFound:
                return _error("not_found", "Volunteer not found", 404)

        return Response(VolunteerSerializer(volunteer).data)