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
        // Handle different error cases based on the server response
        if (data.error === 'email_exists') {
          setInputValidity(prev => ({ ...prev, email: false }));
          setWarningMessage({ email: 'Email Already Exists, Please Login.' });
        } else if (data.error === 'phone_exists') {
          setInputValidity(prev => ({ ...prev, phone: false }));
          setWarningMessage({ phone: 'Number Exists, Please Login.' });
        } else {
          throw new Error(data.message || 'An error occurred during registration.');
        }
      } else {
        console.log('Registration successful', data);
        navigate('/login');
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
        {/* Form fields remain the same, just add onChange to each input */}
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
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required onChange={handleChange} />
          {!inputValidity.email && (
            <div style={{ color: 'red' }}>{warningMessage.email}</div>
          )}
        </div>
        <div className="formGroup">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" required pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" onChange={handleChange} />
          <small>Format: 123-456-7890</small>
          {!inputValidity.phone && (
            <div style={{ color: 'red' }}>{warningMessage.phone}</div>
          )}
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
