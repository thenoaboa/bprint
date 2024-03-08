import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { logout } from './utils';
import './App.css';
import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Profile from './components/Profile/Profile'
import ProjectsPage from './components/ProjectsPage/ProjectsPage';
import CreateProject from './components/CreateProject/CreateProject';

function App() {
  // Using a custom hook for redirection within useEffect
  const CheckAuthAndRedirect = () => {
    const navigate = useNavigate();
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
          const decoded = jwt_decode(token);
          const currentTime = Date.now() / 1000; // Convert to seconds
          if (decoded.exp < currentTime) {
              logout(); // Clear the token and other relevant states
              navigate('/login'); // Redirect to login page
          }
      }
    }, [navigate]);

    return null; // This component does not render anything
  };

  return ( 
    <Router>
      <CheckAuthAndRedirect />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
