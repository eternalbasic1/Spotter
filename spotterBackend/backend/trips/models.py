from django.db import models

class Trip(models.Model):
    driver_name = models.CharField(max_length=100, null=True, blank=True)  # Can be NULL in DB and left blank in forms
    start_date = models.DateField(null=False)  # Allows NULL values
    num_days = models.IntegerField(null=False)
    total_kilometer = models.FloatField(null=False)

class DailyLog(models.Model):
    trip = models.ForeignKey(Trip, related_name="logs", on_delete=models.CASCADE)
    date = models.DateField()
    total_miles_driven = models.IntegerField()
    total_mileage = models.IntegerField()
    carrier_name = models.CharField(max_length=100, null=True, blank=True)
    office_address = models.TextField(null=True, blank=True)
    vehicle_details = models.CharField(max_length=100, null=True, blank=True)
    duty_status = models.JSONField(null=True, blank=True)  # JSON field can be NULL
    remarks = models.TextField(null=True, blank=True)
