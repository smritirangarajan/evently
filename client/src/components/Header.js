// src/components/Header.js
import React from 'react';
import logo from './logo.png';
import './Header.css';

function Header() {
  return (
    <header className="site-header">
      <img src={logo} alt="Logo" className="site-logo" />
    </header>
  );
}

export default Header;
