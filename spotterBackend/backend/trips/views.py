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
from docx import Document
from docx.shared import Inches
from docx2pdf import convert
import tempfile


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

class DailyLogViewSet(viewsets.ModelViewSet):
    queryset = DailyLog.objects.all()
    serializer_class = DailyLogSerializer



from .models import DailyLog, Trip  # Import models

def generate_dailylog_pdf(request, dailylogId):
    # Fetch DailyLog and related Trip data
    daily_log = get_object_or_404(DailyLog, dailylogId=dailylogId)
    trip = daily_log.tripId  # ForeignKey reference

    driver_name = trip.driver_name
    date = daily_log.date.strftime("%Y-%m-%d")
    total_miles_driven = daily_log.total_miles_driven
    total_mileage = daily_log.total_mileage
    carrier_name = daily_log.carrier_name
    vehicle_details = daily_log.vehicle_details

    duty_status_data = daily_log.duty_status  # Extract stored JSON field

    # **Generate Chart**
    status_mapping = {"onDuty": 2.5, "driving": 1.5, "sleeperBerth": 0.5, "offDuty": -0.5}
    activity_labels = ["On Duty", "Driving", "Sleeper Berth", "Off Duty"]
    colors = ["#F9DCC4", "#F4A261", "#264653", "#2A9D8F"]

    time = []
    activity = []
    for entry in duty_status_data:
        time.append(entry["start_time"])
        activity.append(status_mapping[entry["status"]])
        time.append(entry["end_time"])
        activity.append(status_mapping[entry["status"]])

    fig, ax = plt.subplots(figsize=(12, 4))
    for i in range(4):  
        ax.fill_between([0, 24], i-1, i, color=colors[i], alpha=0.5)

    ax.step(time, activity, where='post', color='black', linewidth=2)
    ax.set_yticks([0, 1, 2, 3])
    ax.set_yticklabels(activity_labels, fontsize=12, weight="bold")
    ax.set_xticks(np.arange(0, 25, 1))
    ax.xaxis.set_label_position("top")
    ax.xaxis.tick_top()
    ax.set_xlabel("Time (Hours)", fontsize=12, weight="bold")
    ax.set_ylabel("Activity", fontsize=12, weight="bold")
    ax.set_title(f"Driver's Daily Log (ID: {dailylogId})")
    ax.grid(True, linestyle="--", alpha=0.6)

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
    plt.close(fig)
    buffer.seek(0)

    # **Load Existing .docx Template**
    doc = Document("/Users/kancharakuntlavineethreddy/Developer/Vscode/Spotter/spotterBackend/backend/trips/log_template.docx")

    replacements = {
        "DRIVER_NAME": driver_name,
        "DATE": date,
        "TOTAL_MILES_DRIVEN": str(total_miles_driven),
        "TOTAL_MILEAGE": str(total_mileage),
        "CARRIER_NAME": carrier_name,
        "VEHICLE_DETAILS": vehicle_details
    }

    # **Replace Text Placeholders**
    for paragraph in doc.paragraphs:
        for key, value in replacements.items():
            if key in paragraph.text:
                paragraph.text = paragraph.text.replace(key, value)

    # **Replace Table Cells (if placeholders exist in tables)**
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for key, value in replacements.items():
                    if key in cell.text:
                        cell.text = cell.text.replace(key, value)

    # **Find and Replace GENERATED_IMAGE Placeholder with Image**
    for paragraph in doc.paragraphs:
        if "GENERATED_IMAGE" in paragraph.text:
            paragraph.text = paragraph.text.replace("GENERATED_IMAGE", "")  # Remove the placeholder
            run = paragraph.add_run()  # Create a new run to hold the image
            image_stream = io.BytesIO(buffer.getvalue())
            run.add_picture(image_stream, width=Inches(6))  # Insert image

    # **Save .docx Temporarily**
    with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as temp_docx:
        doc.save(temp_docx.name)
        temp_docx_path = temp_docx.name

    # **Convert .docx to PDF**
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
        convert(temp_docx_path, temp_pdf.name)
        temp_pdf_path = temp_pdf.name

    # **Read PDF and Return as Response**
    with open(temp_pdf_path, "rb") as pdf_file:
        response = HttpResponse(pdf_file.read(), content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="daily_log_{dailylogId}.pdf"'
    
    return response
