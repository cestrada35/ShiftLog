from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from domain.kiosk.authenticate_by_pin import InvalidPinError
from domain.users.pin import InvalidPinFormat
from interfaces.http.container import make_authenticate_by_pin_command
from interfaces.http.serializers import (
    ErrorResponseSerializer,
    KioskAuthRequestSerializer,
    KioskAuthResponseSerializer,
)


class KioskAuthView(APIView):
    def post(self, request):
        serializer = KioskAuthRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        command = make_authenticate_by_pin_command()

        try:
            identification = command.execute(serializer.validated_data["pin"])
        except InvalidPinFormat:
            error = ErrorResponseSerializer(
                {"code": "invalid_pin_format", "message": "PIN must be 4-6 digits"}
            )
            return Response(error.data, status=status.HTTP_400_BAD_REQUEST)
        except InvalidPinError:
            error = ErrorResponseSerializer(
                {"code": "invalid_pin", "message": "PIN not recognized"}
            )
            return Response(error.data, status=status.HTTP_401_UNAUTHORIZED)

        response = KioskAuthResponseSerializer(identification)
        return Response(response.data)
