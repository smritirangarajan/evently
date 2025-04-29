// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/signup/signup";
import CompleteProfile from './pages/completeProfile/completeProfile';
import Login from './pages/login/login';
import LandingPage from './pages/landing/LandingPage';
import Dashboard from './pages/dashboard/Dashboard';
import FindEventsPage from './pages/findEvents/FindEventsPage';
import EventDetailsPage from './pages/findEvents/EventDetailsPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/find-events" element={<FindEventsPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/event/:eventId" element={<EventDetailsPage />} />
      
      </Routes>
    </Router>
  );
}

export default App;
