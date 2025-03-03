# from django.urls import path
# from .views import TripViewSet, DailyLogViewSet

# urlpatterns = [
#     path("trips/", TripViewSet, name="trip_list"),
#     path("dailylogs/", DailyLogViewSet, name="daily_log_list")
# ]


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, DailyLogViewSet

router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'dailylogs', DailyLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
