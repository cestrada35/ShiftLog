from datetime import datetime, timezone
from uuid import uuid4

import pytest

from domain.shifts.shift import Shift, ShiftAlreadyCompleted


def test_check_in_creates_active_shift():
    volunteer_id = uuid4()
    project_id = uuid4()
    now = datetime(2026, 1, 1, 9, 0, tzinfo=timezone.utc)

    shift = Shift.check_in(volunteer_id, project_id, now)

    assert shift.is_active
    assert shift.volunteer_id == volunteer_id
    assert shift.project_id == project_id
    assert shift.started_at == now
    assert shift.ended_at is None


def test_check_out_completes_shift():
    now = datetime(2026, 1, 1, 9, 0, tzinfo=timezone.utc)
    later = datetime(2026, 1, 1, 13, 0, tzinfo=timezone.utc)
    shift = Shift.check_in(uuid4(), uuid4(), now)

    completed = shift.check_out(later)

    assert not completed.is_active
    assert completed.ended_at == later
    assert completed.started_at == now


def test_cannot_check_out_twice():
    now = datetime(2026, 1, 1, 9, 0, tzinfo=timezone.utc)
    shift = Shift.check_in(uuid4(), uuid4(), now).check_out(now)

    with pytest.raises(ShiftAlreadyCompleted):
        shift.check_out(now)