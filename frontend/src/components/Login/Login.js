import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [inputValidity, setInputValidity] = useState({ email: true, password: true });
    const [formValid, setFormValid] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [warningMessage, setWarningMessage] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Always update form data
        setInputValidity(prev => ({ ...prev, [name]: true }));
        setWarningMessage((prev) => ({ ...prev, [name]: '' }));

        if (isFieldEmpty(value)) {
            setInputValidity(prev => ({ ...prev, [name]: false }));
            setWarningMessage(prev => ({
                ...prev,
                [name]: 'Field cannot be empty',
            }));
        } else if (name === 'email' && !isValidEmail(value)) {
            setInputValidity(prev => ({ ...prev, email: false }));
            setWarningMessage(prev => ({
                ...prev,
                email: "Invalid email format. Required '@' and '.'",
            }));
        }

        // Update state with new value
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }

        // Check overall form validity
        checkFormValidity();
    };

    const isFieldEmpty = (value) => {
        return value.trim() === '';
    };
    
    const isValidEmail = (value) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(value);
    };
    
    const checkFormValidity = () => {
        const isEmailValid = isValidEmail(email) && !isFieldEmpty(email);
        const isPasswordValid = !isFieldEmpty(password); // Here you could add more complex rules
        setFormValid(isEmailValid && isPasswordValid);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setWarningMessage({ email: '', password: '' });

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            console.log("Response status: ", response.status);
            const data = await response.json();
            console.log("Response data: ", data);

            if (response.ok) {
                console.log('Login successful', data);
                localStorage.setItem('token', data.token);
                navigate('/'); // Navigate to the homepage
            } else {
                // Specific error messages based on the backend response
                if (data.message.includes('User not found')) {
                    setWarningMessage({ email: 'Email does not exist.', password: '' });
                } else if (data.message.includes('Invalid credentials')) {
                    setWarningMessage({ email: '', password: 'Incorrect password.' });
                } else {
                    setWarningMessage({ email: 'An error occurred during login.', password: 'An error occurred during login.' });
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            // Network error or JSON parsing error
            setWarningMessage({ email: 'Network error or server configuration issue.', password: '' });
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
                        onChange={handleChange}
                        className={!inputValidity.email ? 'invalidInput' : ''}
                    />
                    {warningMessage.email && <div style={{ color: 'red' }}>{warningMessage.email}</div>}
                </div>
                <div className="formGroup">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        className={!inputValidity.password ? 'invalidInput' : ''}
                    />
                    {warningMessage.password && <div style={{ color: 'red' }}>{warningMessage.password}</div>}
                </div>
                <button type="submit" className="btn" disabled={!formValid}>Login</button>
            </form>
            <Link to="/signup">Don't have an account? Sign Up</Link>
        </div>
    );
}

export default Login;
