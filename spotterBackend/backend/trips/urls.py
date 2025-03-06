from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, DailyLogViewSet, generate_dailylog_pdf, replace_and_generate_pdf

router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'dailylogs', DailyLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate/<int:dailylogId>/', generate_dailylog_pdf, name='generate_dailylog_pdf'),
    path("generate-pdf/", replace_and_generate_pdf, name="generate_pdf"),
]
