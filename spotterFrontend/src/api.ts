import axios from "axios";

// Access environment variable
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000/api/"; // Default to a specific URL if not defined

// 🛠️ API Client
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTrips = async () => {
  const response = await apiClient.get("trips/");
  return response.data;
};

export const getTripDetails = async (tripId: number) => {
  try {
    const response = await apiClient.get(`trips/${tripId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching trip details for tripId ${tripId}:`, error);
    throw error;
  }
};

export const createTrip = async (tripData: any) => {
  const response = await apiClient.post("trips/", tripData);
  return response.data;
};

export const createDailyLog = async (logData: any) => {
  const response = await apiClient.post("dailylogs/", logData);
  return response.data;
};

export const generateTripPDF = async (tripId: number) => {
  try {
    const response = await apiClient.get(`generate/${tripId}/`, {
      responseType: "blob", // Important for handling file downloads
    });

    // Create a download link for the ZIP file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `trip_${tripId}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error(`Error generating trip ZIP for tripId ${tripId}:`, error);
    throw error;
  }
};

export const getHealth = async () => {
  const response = await apiClient.get("health/");
  return response.data;
};
