import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode'; // Assuming jwt-decode is used for decoding JWT tokens
import './Profile.css';
import { logout } from '../../utils';

const Profile = () => {
    const [userData, setUserData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
    });
    const [profilePic, setProfilePic] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
  
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwt_decode(token);
                const userId = decoded.id;
                console.log("Decoded TOKEN: ", decoded)
                try {
                    console.log("TOKEN Before GET request: ", token)
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Fetched user data: ", data);
                        setUserData(data);
                    } else {
                        console.error('Failed to fetch user data', await response.text());
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
      fetchUserData();
    }, []);

    const handleLogout = () => {
        logout(); // Call logout function which clears the token and redirects
    };
  
    const handleProfilePicChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfilePic(URL.createObjectURL(file));
        }
    };

    const togglePanel = () => setIsPanelOpen(!isPanelOpen);

    return (
        <div className="profileContainer">
            <button className="hamburgerButton" onClick={togglePanel}>☰</button>
            {isPanelOpen && (
                <div className="navigationPanel">
                    <Link to="/">Home</Link>
                    <Link to="/create-project">New Project</Link>
                    <Link to="/projects">Saved Projects</Link>
                </div>
            )}
            <h2>User Profile</h2>
            <div className="profileInfo">
                <div className="profilePicContainer">
                    <img src={profilePic || "default_profile_pic.png"} alt="Profile" />
                    <input type="file" onChange={handleProfilePicChange} />
                </div>
                <div className="userInfo">
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Phone:</strong> {userData.phone}</p>
                </div>
            </div>
            <button className="changePasswordBtn">Change Password</button>
            <button onClick={handleLogout} className="logoutBtn">Logout</button>
        </div>
    );
};

export default Profile;
