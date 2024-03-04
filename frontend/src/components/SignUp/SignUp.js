import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa'; // Import icons
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const [usernameAvailable, setUsernameAvailable] = useState(null); // null, true, or false
  const [checkingUsername, setCheckingUsername] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Format phone number here if needed
      const formattedPhone = value.replace(/[^\d]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3').slice(0, 12);
      setFormData({ ...formData, [name]: formattedPhone });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "username") {
      setUsernameAvailable(null); // Reset username availability check when the username is changed
    }
  };

  const checkUsernameAvailability = async () => {
    // we have a error for checking username availability, 
    setCheckingUsername(true);
    try {
      // Implement the API call to your backend to check username availability
      const response = await fetch(`/api/check-username?username=${formData.username}`);
      const { available } = await response.json();
      setUsernameAvailable(available);
    } catch (error) {
      console.error('Error checking username availability:', error);
    }
    setCheckingUsername(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (usernameAvailable !== true) {
      alert('Please check if the username is available and try again.');
      return;
    }
    console.log('Registration Button Clicked', formData);

    const registerUrl = process.env.REACT_APP_BACKEND_URL + "/api/auth/register";
  
    try {
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
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
          <div className='UsernameGroup'>
            <input type="text" id="username" name="username" required onChange={handleChange} />
            <button type="button" onClick={checkUsernameAvailability} disabled={checkingUsername} className="checkUsernameBtn">
              {checkingUsername ? <FaSpinner /> : usernameAvailable === null ? <FaSpinner /> : usernameAvailable ? <FaCheck color="green" /> : <FaTimes color="red" />}
            </button>
          </div>
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
        <button type="submit" disabled={usernameAvailable !== true}>Sign Up</button>
      </form>
      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
};

export default SignUp;
