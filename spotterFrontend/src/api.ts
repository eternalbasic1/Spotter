import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";
const TRIPS_URL = "http://127.0.0.1:8000/api/trips/";
const DAILYLOG_URL = "http://127.0.0.1:8000/api/dailylogs/";

export const getTrips = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createTrip = async (tripData: any) => {
  const response = await axios.post(TRIPS_URL, tripData);
  return response.data;
};

export const createDailyLog = async (tripData: any) => {
  const response = await axios.post(DAILYLOG_URL, tripData);
  return response.data;
};
