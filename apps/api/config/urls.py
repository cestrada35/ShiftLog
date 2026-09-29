from django.urls import path, include

urlpatterns = [
    path("api/", include("interfaces.http.urls")),
]