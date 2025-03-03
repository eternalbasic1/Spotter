import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TripForm from "./components/TripForm";
// import TripList from "./components/TripList";
import Home from "./components/Home";
import DailyLogForm from "./components/DailyLogForm";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/trips" element={<TripList />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/trip" element={<TripForm />} />
        <Route path="/dailylog" element={<DailyLogForm />} />
      </Routes>
    </Router>
  );
};

export default App;
