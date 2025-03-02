import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/trips/";

export const getTrips = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createTrip = async (tripData: any) => {
  const response = await axios.post(API_URL, tripData);
  return response.data;
};
