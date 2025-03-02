import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TripForm from "./components/TripForm";
import TripList from "./components/TripList";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TripForm />} />
        <Route path="/trips" element={<TripList />} />
      </Routes>
    </Router>
  );
};

export default App;
