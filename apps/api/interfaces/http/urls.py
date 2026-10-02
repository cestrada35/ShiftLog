from django.urls import path

from interfaces.http.admin_views import (
    AdminWhoAmIView,
    VolunteerDetailView,
    VolunteerListView,
)
from interfaces.http.kiosk_views import (
    CheckInView,
    CheckOutView,
    KioskAuthView,
    ListProjectsView,
)

urlpatterns = [
    # Kiosk
    path("kiosk/auth", KioskAuthView.as_view(), name="kiosk-auth"),
    path("kiosk/projects", ListProjectsView.as_view(), name="kiosk-projects"),
    path("kiosk/check-in", CheckInView.as_view(), name="kiosk-check-in"),
    path("kiosk/check-out", CheckOutView.as_view(), name="kiosk-check-out"),

    # Admin
    path("admin/whoami", AdminWhoAmIView.as_view(), name="admin-whoami"),
    path("admin/volunteers", VolunteerListView.as_view(), name="admin-volunteers"),
    path("admin/volunteers/<uuid:volunteer_id>", VolunteerDetailView.as_view(), name="admin-volunteer-detail"),
]