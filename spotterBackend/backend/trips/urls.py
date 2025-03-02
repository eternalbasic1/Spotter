from django.urls import path
from .views import trip_list

urlpatterns = [
    path("trips/", trip_list, name="trip_list"),
]
