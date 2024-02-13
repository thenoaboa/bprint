import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    console.log('Registration Button Clicked');
    event.preventDefault();
    const registerUrl = 'http://localhost:5000/api/auth/register';

    try {
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful', data);
        navigate('/login'); // Redirect user to login page after successful registration
      } else {
        throw new Error(data.message || 'An error occurred during registration.');
      }
    } catch (error) {
      console.error('Registration failed:', error.message);
      // Handle registration failure, e.g., showing an error message to the user
    }
  };

  return (
    <div className="signUpPage">
      <Link to="/">
        <img src="IB_Icon.png" alt="Home" className="homeIcon" />
      </Link>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields remain the same, just add onChange to each input */}
        <div className="formGroup">
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" required onChange={handleChange} />
        </div>
        <div className="formGroup">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required onChange={handleChange} />
        </div>
        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required onChange={handleChange} />
        </div>
        <div className="formGroup">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" required pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" onChange={handleChange} />
          <small>Format: 123-456-7890</small>
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required onChange={handleChange} />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
};

export default SignUp;
