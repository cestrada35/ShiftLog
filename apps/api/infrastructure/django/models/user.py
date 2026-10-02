import uuid

from django.db import models


class UserModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    pin_hash = models.CharField(max_length=128, unique=True, db_index=True)
    password_hash = models.CharField(max_length=128, blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "shiftlog_user"
        verbose_name = "user"
        verbose_name_plural = "users"