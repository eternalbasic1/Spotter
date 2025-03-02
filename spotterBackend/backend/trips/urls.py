from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, DailyLogViewSet

router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'dailylogs', DailyLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
