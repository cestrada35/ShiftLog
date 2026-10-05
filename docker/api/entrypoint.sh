#!/bin/sh
set -e

echo "[entrypoint] Running migrations..."
python manage.py migrate --noinput

if [ "${SHIFTLOG_DEMO_MODE}" = "true" ]; then
    echo "[entrypoint] Seeding demo data..."
    python manage.py seed_demo
fi

echo "[entrypoint] Starting gunicorn..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers "${GUNICORN_WORKERS:-2}" \
    --access-logfile - \
    --error-logfile - \
    --log-level info