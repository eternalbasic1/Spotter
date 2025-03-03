from rest_framework import serializers
from .models import Trip, DailyLog

class DailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer):
    logs = DailyLogSerializer(many=True, read_only=True)  # ✅ Read-only logs

    class Meta:
        model = Trip
        fields = '__all__'
