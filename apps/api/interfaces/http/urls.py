from django.urls import path

from interfaces.http.kiosk_views import KioskAuthView

urlpatterns = [
    path("kiosk/auth", KioskAuthView.as_view(), name="kiosk-auth"),
]
