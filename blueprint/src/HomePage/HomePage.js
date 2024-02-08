import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import useNavigate
import './HomePage.css';

const HomePage = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="homeContainer">
      <button className="hamburgerButton" onClick={togglePanel}>☰</button>
      {isPanelOpen && (
        <div className="navigationPanel">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
      <div className="centerButtons">
        <Link to="/create-project"><button>Create New Project</button></Link>
        {/* Update this button to call goToProjectsPage on click */}
        <Link to="/projects"><button>View Your Projects</button></Link>
      </div>
    </div>
  );
};

export default HomePage;
