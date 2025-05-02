// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from './logo.png'; // relative to the file you're editing


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/dashboard" className="nav-link">Home</Link>
        <Link to="/find-events" className="nav-link">Find Events</Link>
        <Link to="/my-events" className="nav-link">My Events</Link>
        <Link to="/upcoming-events" className="nav-link">Upcoming Events</Link>
      </div>
      <div className="nav-right">
        <button className="logout-button" onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
};

export default Navbar;
