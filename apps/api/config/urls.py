from django.urls import include, path

urlpatterns = [
    path("api/", include("interfaces.http.urls")),
]