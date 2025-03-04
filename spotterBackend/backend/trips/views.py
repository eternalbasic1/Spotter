from rest_framework import viewsets
from .models import Trip, DailyLog
from .serializers import TripSerializer, DailyLogSerializer

import matplotlib
matplotlib.use('Agg')

import matplotlib.pyplot as plt
import numpy as np
import io
import base64
from django.http import HttpResponse
from django.shortcuts import get_object_or_404


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

class DailyLogViewSet(viewsets.ModelViewSet):
    queryset = DailyLog.objects.all()
    serializer_class = DailyLogSerializer

def generate_dailylog_chart(request, dailylogId):
    daily_log = get_object_or_404(DailyLog, dailylogId=dailylogId)
    duty_status_data = daily_log.duty_status  # Extract stored JSON field
    print("duty_status_data", duty_status_data)
    # Mapping statuses to numeric values for plotting
    status_mapping = {"onDuty": 2.5, "driving": 1.5, "sleeperBerth": 0.5, "offDuty": -0.5}
    activity_labels = ["On Duty", "Driving", "Sleeper Berth", "Off Duty"]
    colors = ["#F9DCC4", "#F4A261", "#264653", "#2A9D8F"]  # Background colors

    # Extracting times and corresponding activity values
    time = []
    activity = []
    for entry in duty_status_data:
        time.append(entry["start_time"])
        activity.append(status_mapping[entry["status"]])
        time.append(entry["end_time"])
        activity.append(status_mapping[entry["status"]])

    # Calculating total hours spent on each activity
    activity_hours = [sum(entry["end_time"] - entry["start_time"] for entry in duty_status_data if entry["status"] == key) for key in status_mapping]

    # Create figure
    fig, ax = plt.subplots(figsize=(12, 4))

    # Fill background for each activity row
    for i in range(4):  
        ax.fill_between([0, 24], i-1, i, color=colors[i], alpha=0.5)  # Entire row background

    # Step plot (on top of background)
    ax.step(time, activity, where='post', color='black', linewidth=2)

    # Formatting
    ax.set_yticks([0, 1, 2, 3])
    ax.set_yticklabels(activity_labels, fontsize=12, weight="bold")

    ax.set_xticks(np.arange(0, 25, 1))
    ax.xaxis.set_label_position("top")  # Move label to top
    ax.xaxis.tick_top()  # Move tick labels to top
    ax.set_xlabel("Time (Hours)", fontsize=12, weight="bold")

    ax.set_ylabel("Activity", fontsize=12, weight="bold")
    ax.set_title(f"Driver's Daily Log (ID: {dailylogId})")
    ax.grid(True, linestyle="--", alpha=0.6)

    # Add total hours text on the right side
    for i, hours in enumerate(activity_hours):
        ax.text(24.05, i - 0.5, f"{hours:02}:00:00", fontsize=10, weight="bold", va="center", ha="left")

    # Add "Total Hours" label at the top of the last column
    ax.text(24.3, 3.4, "Total Hours", fontsize=8, weight="bold", ha="left")

    # Adjust limits to fit the text
    ax.set_xlim(0, 26)  # Extend right side for text spacing

    # Save plot to a BytesIO object
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
    plt.close(fig)
    buffer.seek(0)
    # plt.savefig("finalize.png", dpi=300, bbox_inches='tight')


    return HttpResponse(buffer.getvalue(), content_type='image/png')
