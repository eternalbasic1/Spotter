import React, { useEffect, useState } from "react";
import { getTrips } from "../api";

const TripList: React.FC = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    async function fetchTrips() {
      const data = await getTrips();
      setTrips(data);
    }
    fetchTrips();
  }, []);

  return (
    <ul>
      {trips.map((trip: any, index: number) => (
        <li key={index}>
          {trip.current_location} → {trip.dropoff_location} (
          {trip.cycle_hours_used} hrs)
        </li>
      ))}
    </ul>
  );
};

export default TripList;
