import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import TripForm from "./components/TripForm";
import Home from "./components/Home";
import DailyLogForm from "./components/DailyLogForm";
import GenerateTripPDF from "./components/GenerateTripPDF";
import "./index.css";

const GenerateTripPDFWrapper: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  return tripId ? (
    <GenerateTripPDF tripId={tripId} />
  ) : (
    <h2>Trip ID not found</h2>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trip" element={<TripForm />} />
        <Route path="/dailylog/:tripId" element={<DailyLogForm />} />
        <Route path="/generate/:tripId" element={<GenerateTripPDFWrapper />} />
      </Routes>
    </Router>
  );
};

export default App;
