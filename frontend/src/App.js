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
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        logout(); // Call the logout function if the token has expired
      }
    }
  }, []);

  return (
    <Router>
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
