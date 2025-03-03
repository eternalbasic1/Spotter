import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createDailyLog } from "../api";
import "./styles.css"; // Import styles

// Define the DailyLog interface
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
  const navigate = useNavigate();

  // Retrieve trip data safely
  const tripDataString = localStorage.getItem("tripData");
  const tripData = tripDataString ? JSON.parse(tripDataString) : null;

  // Initialize daily logs based on tripData.num_days
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(
    Array.from({ length: tripData?.num_days || 0 }, (_, _index) => ({
      date: "",
      total_miles_driven: 0,
      total_mileage: 0,
      tripId: tripData?.tripId || 0,
    }))
  );

  // Handle input changes for each log
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

  // Submit all daily logs
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

  return (
    <div className="card">
      <h2 className="subtitle">Enter Daily Logs</h2>
      <form onSubmit={submitDailyLogs} className="form">
        {dailyLogs.map((_log, index) => (
          <div key={index} className="log-container">
            <h3 className="log-title">Day {index + 1}</h3>
            <input
              type="date"
              name="date"
              onChange={(e) => handleDailyLogChange(index, e)}
              required
              className="input"
            />
            <input
              type="number"
              placeholder="Total Miles Driven"
              name="total_miles_driven"
              onChange={(e) => handleDailyLogChange(index, e)}
              required
              className="input"
            />
            <input
              type="number"
              placeholder="Total Mileage"
              name="total_mileage"
              onChange={(e) => handleDailyLogChange(index, e)}
              required
              className="input"
            />
            <input
              type="text"
              placeholder="Carrier Name"
              name="carrier_name"
              onChange={(e) => handleDailyLogChange(index, e)}
              className="input"
            />
            <input
              type="text"
              placeholder="Office Address"
              name="office_address"
              onChange={(e) => handleDailyLogChange(index, e)}
              className="input"
            />
            <input
              type="text"
              placeholder="Vehicle Details"
              name="vehicle_details"
              onChange={(e) => handleDailyLogChange(index, e)}
              className="input"
            />
            <input
              type="text"
              placeholder="Duty Status (JSON)"
              name="duty_status"
              onChange={(e) => handleDailyLogChange(index, e)}
              className="input"
            />
            <input
              type="text"
              placeholder="Remarks"
              name="remarks"
              onChange={(e) => handleDailyLogChange(index, e)}
              className="input"
            />
          </div>
        ))}
        <button type="submit" className="button">
          Submit Daily Logs
        </button>
      </form>
    </div>
  );
};

export default DailyLogForm;
