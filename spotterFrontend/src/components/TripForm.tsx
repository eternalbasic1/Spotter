import { useNavigate } from "react-router-dom";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { createTrip } from "../api";

interface Trip {
  driver_name: string;
  start_date: string;
  num_days: number | "";
  total_kilometer: number | "";
}

const TripForm: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<Trip>({
    driver_name: "",
    start_date: "",
    num_days: "",
    total_kilometer: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        value === ""
          ? ""
          : name === "num_days" || name === "total_kilometer"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const tripData = await createTrip(form);
      navigate(`/dailylog/${tripData.tripId}`); // Navigate with tripId in the URL
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
          Enter Trip Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Driver Name
            </label>
            <input
              type="text"
              name="driver_name"
              value={form.driver_name}
              onChange={handleChange}
              placeholder="Enter driver name"
              required
              className="w-full p-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
              className="w-full p-2 border text-black bg-white border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Number of Days
            </label>
            <input
              type="number"
              name="num_days"
              value={form.num_days === "" ? "" : form.num_days}
              onChange={handleChange}
              min={1}
              placeholder="Enter number of days"
              className="w-full p-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Total Kilometers
            </label>
            <input
              type="number"
              name="total_kilometer"
              value={form.total_kilometer === "" ? "" : form.total_kilometer}
              onChange={handleChange}
              min={0}
              placeholder="Enter total kilometers"
              className="w-full p-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-medium hover:bg-gray-800 transition"
          >
            Submit Trip
          </button>
        </form>
      </div>
    </div>
  );
};

export default TripForm;
