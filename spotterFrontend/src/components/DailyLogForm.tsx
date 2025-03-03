import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTripDetails, createDailyLog } from "../api";

interface DailyLog {
  date: string;
  total_miles_driven: number;
  total_mileage: number;
  carrier_name?: string;
  office_address?: string;
  vehicle_details?: string;
  duty_status?: string;
  remarks?: string;
  tripId: number;
}

const DailyLogForm: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const tripData = await getTripDetails(Number(tripId));

        if (!tripData || Object.keys(tripData).length === 0) {
          setError("No Trip found with this ID.");
          return;
        }

        setDailyLogs(
          Array.from({ length: tripData.num_days }, () => ({
            date: "",
            total_miles_driven: 0,
            total_mileage: 0,
            tripId: tripData.tripId,
          }))
        );
      } catch (error) {
        setError("No Trip exists with the given Trip ID.");
      }
    };

    fetchTripData();
  }, [tripId]);

  const handleDailyLogChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setDailyLogs((prevLogs) =>
      prevLogs.map((log, i) =>
        i === index
          ? { ...log, [name]: name.includes("total") ? Number(value) : value }
          : log
      )
    );
  };

  const submitDailyLogs = async (e: FormEvent) => {
    e.preventDefault();
    try {
      for (const log of dailyLogs) {
        await createDailyLog(log);
      }
      alert("Daily logs submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting daily logs:", error);
    }
  };

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center bg-white">
        <p className="text-xl font-semibold text-red-600">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 transition"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-semibold text-black text-center mb-6 mt-12">
          Enter Daily Logs
        </h2>
        <form onSubmit={submitDailyLogs} className="space-y-5">
          {dailyLogs.map((_log, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 mb-4"
            >
              <h3 className="text-lg font-medium text-black mb-3">
                Day {index + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  onChange={(e) => handleDailyLogChange(index, e)}
                  required
                  className="w-full p-2 border border-gray-300 text-black bg-white rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="number"
                  name="total_miles_driven"
                  placeholder="Total Miles Driven"
                  onChange={(e) => handleDailyLogChange(index, e)}
                  required
                  className="w-full p-2 border border-gray-300 text-black bg-white rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-medium hover:bg-gray-800 transition"
          >
            Submit Daily Logs
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyLogForm;
