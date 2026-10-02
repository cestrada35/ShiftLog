from rest_framework import serializers


class KioskAuthRequestSerializer(serializers.Serializer):
    pin = serializers.CharField(min_length=4, max_length=6)


class VolunteerSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()


class ShiftSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    volunteerId = serializers.UUIDField(source="volunteer_id")
    projectId = serializers.UUIDField(source="project_id")
    startedAt = serializers.DateTimeField(source="started_at")
    endedAt = serializers.DateTimeField(source="ended_at", allow_null=True)


class KioskAuthResponseSerializer(serializers.Serializer):
    volunteer = VolunteerSerializer()
    activeShift = ShiftSerializer(source="active_shift", allow_null=True)


class ErrorResponseSerializer(serializers.Serializer):
    code = serializers.CharField()
    message = serializers.CharField()

class ProjectSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()
    description = serializers.CharField()


class CheckInRequestSerializer(serializers.Serializer):
    volunteerId = serializers.UUIDField(source="volunteer_id")
    projectId = serializers.UUIDField(source="project_id")


class CheckOutRequestSerializer(serializers.Serializer):
    shiftId = serializers.UUIDField(source="shift_id")

class AdminSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    email = serializers.EmailField()
    name = serializers.CharField()

class VolunteerSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()
    isActive = serializers.BooleanField(source="is_active")


class CreateVolunteerRequestSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=1, max_length=255)


class UpdateVolunteerRequestSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=1, max_length=255, required=False)
    isActive = serializers.BooleanField(source="is_active", required=False)