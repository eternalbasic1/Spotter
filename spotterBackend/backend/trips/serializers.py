from rest_framework import serializers
from .models import Trip, DailyLog

class DailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer):
    logs = DailyLogSerializer(many=True)  # ✅ Allow logs to be sent inside the request

    class Meta:
        model = Trip
        fields = '__all__'

    def create(self, validated_data):
        logs_data = validated_data.pop('logs', [])  # Extract logs array
        trip = Trip.objects.create(**validated_data)  # Create Trip entry
        for log_data in logs_data:
            DailyLog.objects.create(trip=trip, **log_data)  # Create logs linked to trip
        return trip
