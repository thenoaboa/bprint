import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation
import './Login.css'; // Ensure you've imported the CSS

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents the default form submission mechanism
        console.log('Submitting', { email, password });
        // Here you can add your logic to send the email and password to your server for authentication
        // For example, using fetch or axios to send a POST request
    };

    return (
        <div className="loginPage">
        <Link to="/">
            <img src="IB_Icon.png" alt="Home" className="homeIcon" />
        </Link>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <div className="formGroup">
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            <div className="formGroup">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <button type="submit" className="btn">Login</button>
        </form>
        <Link to="/signup" >Don't have an account? Sign Up</Link>
        </div>
    );
}

export default Login;