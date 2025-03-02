import React, { useState } from "react";
import { createTrip } from "../api";

const TripForm: React.FC = () => {
  const [form, setForm] = useState({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    cycle_hours_used: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTrip(form);
    alert("Trip created successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="current_location"
        placeholder="Current Location"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="pickup_location"
        placeholder="Pickup Location"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="dropoff_location"
        placeholder="Dropoff Location"
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="cycle_hours_used"
        placeholder="Cycle Hours Used"
        onChange={handleChange}
        required
      />
      <button type="submit">Submit Trip</button>
    </form>
  );
};

export default TripForm;
