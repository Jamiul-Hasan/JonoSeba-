import React from 'react';
import { Link } from 'react-router-dom'; // এই সেই লাইন যা আমি যোগ করতে বলেছিলাম
import '../App.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>জনসেবা (JonoSeba)</h2>
      </div>
      <ul className="navbar-links">
        {/* নিচের লাইনে আমি <li> এর ভেতর <Link> ব্যবহার করেছি */}
        <li>
          <Link to="/" style={{color: 'white', textDecoration: 'none'}}>হোম</Link>
        </li>
        
        <li>সেবা সমূহ</li>
        <li>সমস্যা জানান</li>
        
        {/* লগইন বাটনকেও লিংক করে দিলাম */}
        <li>
          <Link to="/login" style={{color: 'white', textDecoration: 'none'}}>লগইন</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;