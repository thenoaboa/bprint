import React, { useState, useEffect} from 'react';
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
                        //warning here
  const [inputValidity, setInputValidity] = useState({
    fullName: true,
    username: true,
    email: true,
    phone: true,
    password: true,
});

  const [warningMessage, setWarningMessage] = useState('Test warning message');
  const [usernameAvailable, setUsernameAvailable] = useState(null); // null, true, or false
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    console.log(warningMessage); // This logs whenever warningMessage changes.
  }, [warningMessage]);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Remove non-numeric characters and slice to max 10 characters
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      // Automatically add dashes for readability
      const formattedValue = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "username") {
      setUsernameAvailable(null); // Reset username availability check when the username is changed
      setWarningMessage('');
    }
  };

  const checkUsernameAvailability = async () => {
    setCheckingUsername(true);
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+`/api/auth/check-username?username=${formData.username}`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('Failed to check username availability');
      const data = await response.json();
      setUsernameAvailable(data.available);
      setInputValidity(prev => ({ ...prev, username: data.available }));
      setCheckingUsername(false);
    } catch (error) {
      console.error('Error checking username availability:', error);
      setCheckingUsername(false);
      setUsernameAvailable(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Check if the username is blank
  if (!formData.username) {
    setWarningMessage('Username is required.');
    console.log(warningMessage);
    return;
  }

  // Check if the username is not available
  if (usernameAvailable === false) {
    setWarningMessage('Please choose a username that is available.');
    console.log(warningMessage);
    return;
  }

    console.log('Registration Button Clicked', formData);
  
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/auth/register", {
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
          <label htmlFor="username" style={{ color: inputValidity.username ? 'black' : 'red' }}>Username</label>
          <div className='UsernameGroup'>
            <input type="text" id="username" name="username" required onChange={handleChange} />
            <button type="button" onClick={checkUsernameAvailability} disabled={checkingUsername} className="checkUsernameBtn">
              {checkingUsername ? <FaSpinner /> : usernameAvailable === null ? <FaSpinner /> : usernameAvailable ? <FaCheck color="green" /> : <FaTimes color="red" />}
            </button>
          </div>
          {!inputValidity.username && (
              <div style={{ color: 'red' }}>Please enter a valid username.</div>
          )}
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
        {warningMessage && (
          <div className="warningMessage">
            {warningMessage}
          </div>
        )}
        <button type="submit" disabled={usernameAvailable !== true}>Sign Up</button>
      </form>
      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
};

export default SignUp;
