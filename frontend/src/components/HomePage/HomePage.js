import React, { useState, useEffect } from 'react';
import { jwtDecode as jwt_decode } from 'jwt-decode'; // Corrected import statement
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      console.log('User ID from token:', decodedToken.id);
      setUserId(decodedToken.id); // Store user ID from token
    }
  }, []);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="homeContainer">
      <button className="hamburgerButton" onClick={togglePanel}>☰</button>
      {isPanelOpen && (
        <div className="navigationPanel">
          <Link to="/">Home</Link>
          {userId ? <Link to="/profile">Profile</Link> : <Link to="/login">Login/Sign Up</Link>}
          <Link to="/create-project">New Project</Link>
          <Link to="/projects">Saved Projects</Link>
        </div>
      )}
      <div className="centerButtons">
        <Link to="/create-project"><button>Create New Project</button></Link>
        <Link to="/projects"><button>View Your Projects</button></Link>
      </div>
    </div>
  );
};

export default HomePage;
