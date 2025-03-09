import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/";
// const TRIPS_URL = `${BASE_URL}trips/`;
// const DAILYLOG_URL = `${BASE_URL}dailylogs/`;
const GENERATE_PDF_URL = "http://127.0.0.1:8000/api/generate/"; // Direct API for ZIP file

// 🛠️ API Client
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 📌 Fetch all trips
export const getTrips = async () => {
  const response = await apiClient.get("trips/");
  return response.data;
};

// 📌 Fetch trip details by ID
export const getTripDetails = async (tripId: number) => {
  try {
    const response = await apiClient.get(`trips/${tripId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching trip details for tripId ${tripId}:`, error);
    throw error;
  }
};

// 📌 Create a new trip
export const createTrip = async (tripData: any) => {
  const response = await apiClient.post("trips/", tripData);
  return response.data;
};

// 📌 Create a daily log
export const createDailyLog = async (logData: any) => {
  const response = await apiClient.post("dailylogs/", logData);
  return response.data;
};

// 📌 Generate trip ZIP file
export const generateTripPDF = async (tripId: number) => {
  try {
    const response = await apiClient.get(`${GENERATE_PDF_URL}${tripId}/`, {
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
