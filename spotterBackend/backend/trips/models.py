from django.db import models

class Trip(models.Model):
    tripId = models.AutoField(primary_key=True)  # ✅ Explicit Primary Key
    driver_name = models.CharField(max_length=100, null=True, blank=True)
    start_date = models.DateField(null=False)
    num_days = models.IntegerField(null=False)
    total_kilometer = models.FloatField(null=False)

    def __str__(self):
        return f"Trip {self.tripId} - {self.driver_name}"  # ✅ Fixed tripId reference

class DailyLog(models.Model):
    dailylogId = models.AutoField(primary_key=True)  # ✅ Explicit Primary Key
    tripId = models.ForeignKey(Trip, related_name="logs", on_delete=models.CASCADE)  # ✅ Renamed tripId -> trip
    date = models.DateField()
    total_miles_driven = models.IntegerField()
    total_mileage = models.IntegerField()
    carrier_name = models.CharField(max_length=100, null=True, blank=True)
    office_address = models.TextField(null=True, blank=True)
    vehicle_details = models.CharField(max_length=100, null=True, blank=True)
    duty_status = models.JSONField(default=list, blank=True)
    remarks = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"DailyLog {self.dailylogId} for Trip {self.trip.tripId}"