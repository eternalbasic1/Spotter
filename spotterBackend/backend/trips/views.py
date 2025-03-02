from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Trip
from .serializers import TripSerializer

@api_view(["GET", "POST"])
def trip_list(request):
    if request.method == "GET":
        trips = Trip.objects.all()
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = TripSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
