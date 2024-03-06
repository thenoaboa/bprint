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

  const [inputValidity, setInputValidity] = useState({
    fullName: true,
    username: true,
    email: true,
    phone: true,
    password: true,
  });

  // Initialize warningMessage as an object to store messages for individual fields
  const [warningMessage, setWarningMessage] = useState({});
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Resetting specific warning message and validity on change for all inputs
    setWarningMessage((prevMessages) => ({ ...prevMessages, [name]: '' }));
    setInputValidity((prevValidity) => ({ ...prevValidity, [name]: true }));

    if (name === 'phone') {
      // Your existing phone formatting logic
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      const formattedValue = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      setFormData({ ...formData, [name]: formattedValue });
    } else if (name === 'password') {
      // New password validation logic
      const minLength = 8;
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      if (value.length < minLength || !hasSpecialChar) {
        setInputValidity((prev) => ({ ...prev, [name]: false }));
        setWarningMessage((prev) => ({
          ...prev,
          [name]: `At least ${minLength} characters long, At least one special character.`,
        }));
      }
      setFormData({ ...formData, [name]: value });
    } else {
      // Handle all other inputs
      setFormData({ ...formData, [name]: value });
    }

    // Reset username availability on username change
    if (name === "username") {
      setUsernameAvailable(null);
    }
  };

  const checkUsernameAvailability = async () => {
    setCheckingUsername(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/check-username?username=${formData.username}`);
      if (!response.ok) throw new Error('Failed to check username availability');
      const data = await response.json();
      setUsernameAvailable(data.available);
      // Set input validity for username based on availability
      setInputValidity((prev) => ({ ...prev, username: data.available }));
      // Update the warning message based on username availability
      setWarningMessage(data.available ? '' : 'Username Taken');
      setCheckingUsername(false);
    } catch (error) {
      console.error('Error checking username availability:', error);
      setCheckingUsername(false);
      setUsernameAvailable(false);
      // In case of an error, consider showing a generic error message
      setWarningMessage('Error checking username. Try again.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCheckingUsername(true);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Update inputValidity based on the errors returned
        setInputValidity(prev => ({
          ...prev,
          email: !data.email,
          phone: !data.phone,
        }));
        // Update warningMessage based on the errors returned
        setWarningMessage(data);
      } else {
        console.log('Registration successful', data);
        navigate('/login'); // Redirect to login
      }
    } catch (error) {
      console.error('Registration failed:', error.message);
    } finally {
      setCheckingUsername(false);
    }
  };

  return (
    <div className="signUpPage">
      <Link to="/">
        <img src="IB_Icon.png" alt="Home" className="homeIcon" />
      </Link>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" required onChange={handleChange} />
        </div>
        <div className="formGroup">
          <label htmlFor="username" style={{ color: inputValidity.username ? 'black' : 'red' }}>Username</label>
          <div className='UsernameGroup'>
            <input type="text" id="username" name="username" required onChange={handleChange} />
            <button type="button" onClick={checkUsernameAvailability} disabled={checkingUsername} className={`checkUsernameBtn ${
              checkingUsername ? 'loading' : usernameAvailable === true ? 'available' : usernameAvailable === false ? 'unavailable' : ''
            }`}>
                {checkingUsername ? <FaSpinner color="white" /> : usernameAvailable === null ? <FaSpinner color="white" /> : usernameAvailable ? <FaCheck color="white" /> : <FaTimes color="white" />}
            </button>
          </div>
          {!inputValidity.username && (
            <div style={{ color: 'red' }}>{warningMessage}</div>
          )}
        </div>
        <div className="formGroup">
          <label htmlFor="email" style={{ color: inputValidity.email ? 'black' : 'red' }}>Email</label>
          <input type="email" id="email" name="email" required onChange={handleChange} />
          {warningMessage.email && <div style={{ color: 'red' }}>{warningMessage.email}</div>}
        </div>
        <div className="formGroup">
          <label htmlFor="phone" style={{ color: inputValidity.phone ? 'black' : 'red' }}>Phone Number</label>
          <input type="tel" id="phone" name="phone" required onChange={handleChange} />
          {warningMessage.phone && <div style={{ color: 'red' }}>{warningMessage.phone}</div>}
        </div>


        <div className="formGroup">
          <label htmlFor="password" style={{ color: inputValidity.password ? 'black' : 'red' }}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            onChange={handleChange}
            className={inputValidity.password ? '' : 'invalidInput'}
          />
          {!inputValidity.password && (
            <div className="warningContainer">
              <div className="invalidLabel">{warningMessage.password}</div>
            </div>
          )}
        </div>
        <button type="submit" disabled={usernameAvailable !== true || checkingUsername}>Sign Up</button>
      </form>
      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
};

export default SignUp;
