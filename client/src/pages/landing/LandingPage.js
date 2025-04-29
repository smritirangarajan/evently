// src/pages/landing/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome!</h1>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => navigate("/login")} 
          style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
        >
          Log In
        </button>
        <button 
          onClick={() => navigate("/signup")} 
          style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
