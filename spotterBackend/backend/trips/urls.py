from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, DailyLogViewSet, generate_trip_pdfs

router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'dailylogs', DailyLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate/<int:trip_id>/', generate_trip_pdfs, name='generate_dailylog_pdf'),
]
