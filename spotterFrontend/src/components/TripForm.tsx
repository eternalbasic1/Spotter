import { useNavigate } from "react-router-dom";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { createTrip } from "../api";
import "./styles.css"; // Import styles

// Define the Trip interface
interface Trip {
  driver_name: string;
  start_date: string;
  num_days: number;
  total_kilometer: number;
}

const TripForm: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<Trip>({
    driver_name: "",
    start_date: "",
    num_days: 1,
    total_kilometer: 0,
  });

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]:
        name === "num_days" || name === "total_kilometer"
          ? Number(value)
          : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const tripData = await createTrip(form);
      localStorage.setItem("tripData", JSON.stringify(tripData));
      navigate("/dailylog");
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  return (
    <div className="card">
      <div>
        <h2 className="subtitle">Enter Trip Details</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Driver Name"
            name="driver_name"
            value={form.driver_name}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="number"
            placeholder="Number of Days"
            name="num_days"
            value={form.num_days}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="number"
            placeholder="Total Kilometers"
            name="total_kilometer"
            value={form.total_kilometer}
            onChange={handleChange}
            required
            className="input"
          />
          <button type="submit" className="button">
            Submit Trip
          </button>
        </form>
      </div>
    </div>
  );
};

export default TripForm;
