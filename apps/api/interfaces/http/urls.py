from django.urls import path

from interfaces.http.kiosk_views import (
    CheckInView,
    CheckOutView,
    KioskAuthView,
    ListProjectsView,
)

urlpatterns = [
    path("kiosk/auth", KioskAuthView.as_view(), name="kiosk-auth"),
    path("kiosk/projects", ListProjectsView.as_view(), name="kiosk-projects"),
    path("kiosk/check-in", CheckInView.as_view(), name="kiosk-check-in"),
    path("kiosk/check-out", CheckOutView.as_view(), name="kiosk-check-out"),
]