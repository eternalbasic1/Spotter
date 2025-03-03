from rest_framework import serializers
from .models import Trip, DailyLog


class DailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = "__all__"  # ✅ Includes duty_status as an array of JSON

    def validate_duty_status(self, value):
        """
        Validate that duty_status is an array of JSON objects.
        """
        if not isinstance(value, list):
            raise serializers.ValidationError("Duty status must be a list of JSON objects.")
        
        for entry in value:
            if not isinstance(entry, dict):
                raise serializers.ValidationError("Each duty status entry must be a JSON object.")
            if "status" not in entry or "start_time" not in entry or "end_time" not in entry:
                raise serializers.ValidationError("Each duty status entry must contain 'status', 'start_time', and 'end_time'.")
            if not (0 <= entry["start_time"] < 24) or not (0 <= entry["end_time"] <= 24):
                raise serializers.ValidationError("Start and end times must be between 0 and 24 hours.")
            if entry["start_time"] >= entry["end_time"]:
                raise serializers.ValidationError("Start time must be less than end time.")

        return value

class TripSerializer(serializers.ModelSerializer):
    logs = DailyLogSerializer(many=True, read_only=True)  # ✅ Read-only logs

    class Meta:
        model = Trip
        fields = '__all__'
