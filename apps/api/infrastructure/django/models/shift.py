import uuid

from django.db import models


class ShiftModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    volunteer = models.ForeignKey(
        "shiftlog.UserModel",
        on_delete=models.PROTECT,
        related_name="shifts",
    )
    project = models.ForeignKey(
        "shiftlog.ProjectModel",
        on_delete=models.PROTECT,
        related_name="shifts",
    )
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "shiftlog_shift"
        indexes = [
            models.Index(
                fields=["volunteer", "ended_at"],
                name="shiftlog_shift_active_idx",
            ),
        ]