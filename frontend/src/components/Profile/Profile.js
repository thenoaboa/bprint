import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode'; // Assuming jwt-decode is used for decoding JWT tokens
import './Profile.css';
import { logout } from '../../utils';
import { uploadImage } from '../../services/imageService';

const Profile = () => {
    const [userData, setUserData] = useState({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        profilePicUrl: '',
    });
    const [profilePic, setProfilePic] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
  
    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwt_decode(token);
            const userId = decoded.id;
            try {
                console.log("TOKEN Before GET request: ", token)
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    if (data.profilePicUrl) {
                        setProfilePic(data.profilePicUrl);
                    }
                } else {
                    console.error('Failed to fetch user data', await response.text());
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    };
    
    useEffect(() => {
        fetchUserData();
    }, []);

    const handleLogout = () => {
        logout(); // Call logout function which clears the token and redirects
    };

    const handleProfilePicClick = () => {
        document.getElementById("fileInput").click();
    };
  
    const handleProfilePicChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                // Retrieve token and decode to get userId
                const token = localStorage.getItem('token');
                const decoded = jwt_decode(token);
                const userId = decoded.id;

                // Pass the file, folder name, and userId to uploadImage
                const imageUrl = await uploadImage(file, 'Profile', userId); // Added userId here
                setProfilePic(imageUrl);

                await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/update/${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ profilePicUrl: imageUrl }),
                });

                fetchUserData();
            } catch (error) {
                console.error('Error uploading or updating image:', error);
            }
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
            <div className="profileInfo">
                <div className="profilePicContainer" onClick={handleProfilePicClick}>
                    <img src={profilePic || "default_profile_pic.png"} alt="Profile" />
                    <input type="file" id="fileInput" onChange={handleProfilePicChange} style={{ display: 'none' }} />
                </div>
                <div className="userInfo">
                    <p><strong>Name:</strong> {userData.fullName}</p>
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Phone:</strong> {userData.phone}</p>
                </div>
            </div>
            <button onClick={handleLogout} className="logoutBtn">Logout</button>
        </div>
    );
};

export default Profile;