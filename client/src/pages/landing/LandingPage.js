// src/pages/landing/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import logo from '../../components/logo.png'; // adjust path if needed

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <img src={logo} alt="Evently Logo" className="landing-logo" />
      <h1 className="landing-title">Plan Smarter. Attend Better.</h1>
      <p className="landing-subtitle">Your personalized event dashboard, powered by preferences.</p>
      <div className="landing-buttons">
        <button onClick={() => navigate("/login")} className="landing-btn login">Log In</button>
        <button onClick={() => navigate("/signup")} className="landing-btn signup">Sign Up</button>
      </div>
    </div>
  );
}

export default LandingPage;
