import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Use environment variable for backend URL
        const loginUrl = `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`;

        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful', data);
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            } else {
                throw new Error(data.message || 'An error occurred during login.');
            }
        } catch (error) {
            console.error('Login failed:', error.message);
        }
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
            <Link to="/signup">Don't have an account? Sign Up</Link>
        </div>
    );
}

export default Login;
