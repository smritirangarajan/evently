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
import MyEvents from './pages/dashboard/MyEvents';
import UpcomingEvents from './pages/findEvents/UpcomingEvents';
import Layout from './components/Layout'; // ✅ wrapper with navbar


function App() {
  return (
    <Router>
      <Routes>
        {/* Pages WITHOUT Navbar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/login" element={<Login />} />

        {/* Pages WITH Navbar */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/find-events" element={<Layout><FindEventsPage /></Layout>} />
        <Route path="/event/:eventId" element={<Layout><EventDetailsPage /></Layout>} />
        <Route path="/my-events" element={<Layout><MyEvents /></Layout>} />
        <Route path="/upcoming-events" element={<Layout><UpcomingEvents /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
