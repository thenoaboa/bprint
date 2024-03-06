import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa'; // Import icons
import './SignUp.css';

const SignUp = () => {
  // Initialize formData with all fields set to empty strings
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  // Initialize inputValidity to track the validation state of each field
  const [inputValidity, setInputValidity] = useState({
    fullName: true,
    username: true, // Initially consider all fields valid
    email: true,
    phone: true,
    password: true,
  });

  // Initialize warningMessage to hold validation messages
  const [warningMessage, setWarningMessage] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasSpecialChar;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Always update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Field is valid initially (this may be overridden by specific checks below)
    setInputValidity((prev) => ({ ...prev, [name]: true }));
    setWarningMessage((prev) => ({ ...prev, [name]: '' }));

    // Check if the field is empty
    const isFieldEmpty = value.trim() === '';
    if (isFieldEmpty) {
      setInputValidity((prev) => ({ ...prev, [name]: false }));
      setWarningMessage((prev) => ({
        ...prev,
        [name]: 'Field cannot be empty',
      }));
      return; // No need to proceed with further checks if field is empty
    }

    if (name === 'username'){
      // Check if username is empty or not according to the new requirements
      const isValidUsername = /^[a-zA-Z0-9_$]+$/.test(value); // Allow letters, numbers, underscores, and dollar signs
      if (!isValidUsername) {
        setInputValidity((prev) => ({ ...prev, [name]: false }));
        setWarningMessage((prev) => ({
          ...prev,
          [name]: 'Username can only contain letters, numbers, underscores, and dollar signs. No spaces allowed.',
        }));
        return; // No need to proceed with further checks if username is invalid
      }
      
      // Reset username check state to encourage re-validation
      setUsernameAvailable(null);
      
      // If username has not been checked yet, prompt the user to check its availability
      if (usernameAvailable === null && !isFieldEmpty) {
        setInputValidity((prev) => ({ ...prev, [name]: false }));
        setWarningMessage((prev) => ({
          ...prev,
          [name]: 'Click button to verify availability.',
        }));
      }
    }

    if (name === 'email'){
      //check email;
      const isValidEmail = /\S+@\S+\.\S+/.test(value);
      if (!isValidEmail) {
        setInputValidity((prev) => ({ ...prev, email: false }));
        setWarningMessage((prev) => ({
          ...prev,
          email: "Invalid email format. Required '@' and '.'",
        }));
      }
    }

    if (name === 'phone'){
      //check phone;
      const isValidPhone = /^\d{10}$/.test(value.replace(/[\s-]/g, ''));
      if (!isValidPhone) {
        setInputValidity((prev) => ({ ...prev, phone: false }));
        setWarningMessage((prev) => ({
          ...prev,
          phone: "Invalid Number, Required format '###-###-####' or without the '-'",
        }));
      }
    }

    if (name === 'password') {
      //check password;
      const isValidPassword = validatePassword(value);
      if (!isValidPassword) {
        setInputValidity((prev) => ({ ...prev, [name]: false }));
        setWarningMessage((prev) => ({
          ...prev,
          [name]: 'Password must be at least 8 characters long and include a special character.',
        }));
      }
    }
  };

  const checkUsernameAvailability = async () => {
    // Define the regex pattern for allowed username characters
    const usernamePattern = /^[a-zA-Z0-9_$]+$/; // Adjust pattern as needed

    // Check if the username matches the allowed pattern
    if (!usernamePattern.test(formData.username)) {
      // If the username contains incorrect characters, update state accordingly
      setUsernameAvailable(false); // Indicates username is not available because it's invalid
      setInputValidity((prev) => ({ ...prev, username: false }));
      setWarningMessage((prev) => ({
        ...prev,
        username: 'Username can only contain letters, numbers, underscores, and dollar signs. No spaces allowed.',
      }));
      setCheckingUsername(false);
      return false; // No need to check the database
    }

    // Proceed with checking username availability against the database
    setCheckingUsername(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/check-username?username=${formData.username}`);
      if (!response.ok) throw new Error('Failed to check username availability');
      const data = await response.json();
      setUsernameAvailable(data.available);
      setInputValidity((prev) => ({ ...prev, username: data.available }));
      setWarningMessage((prev) => ({
        ...prev,
        username: data.available ? '' : 'Username is taken',
      }));
      setCheckingUsername(false);
      return data.available; // Return the availability status
    } catch (error) {
      console.error('Error checking username availability:', error);
      setCheckingUsername(false);
      setUsernameAvailable(false);
      setWarningMessage((prev) => ({ ...prev, username: 'Error checking username. Try again.' }));
      return false; // Assume unavailable on error
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let formIsValid = true;
    let newWarningMessages = {...warningMessage}; // Start with current warning messages

    // First, ensure username meets all criteria before checking its availability
    if (formData.username) {
      const isValidUsername = /^[a-zA-Z0-9_$]+$/.test(formData.username);
      if (!isValidUsername) {
        formIsValid = false;
        newWarningMessages['username'] = 'Username can only contain letters, numbers, underscores, and dollar signs. No spaces allowed.';
        setInputValidity(prev => ({ ...prev, username: false }));
      } else if (usernameAvailable === null) {
        // If username hasn't been checked and is valid, check its availability
        await checkUsernameAvailability();
        // Re-evaluate form validity based on the updated usernameAvailable state
        if (!usernameAvailable) {
              formIsValid = false;
          newWarningMessages['username'] = 'Username is taken';
          setInputValidity(prev => ({ ...prev, username: false }));
        }
      }
    }

    // Check for empty fields and invalid states in other fields
    Object.keys(formData).forEach(key => {
      if (!formData[key].trim()) {
        formIsValid = false;
        newWarningMessages[key] = 'Field cannot be empty';
        setInputValidity(prev => ({ ...prev, [key]: false }));
      }
    });

    // Update warning messages based on final checks
    setWarningMessage(newWarningMessages);

    if (!formIsValid) {
      // If form is invalid, stop processing and don't submit
      return;
    }
  
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
        {/* Full Name */}
        <div className="formGroup">
          <label htmlFor="fullName" style={{ color: inputValidity.fullName ? 'inherit' : 'red' }}>
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={!inputValidity.fullName ? 'invalidInput' : ''}
          />
          {warningMessage.fullName && <div style={{ color: 'red' }}>{warningMessage.fullName}</div>}
        </div>

        {/* Username */}
        <div className="formGroup">
          <label htmlFor="username" style={{ color: inputValidity.username ? 'inherit' : 'red' }}>
            Username
          </label>
          <div className='UsernameGroup'>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={!inputValidity.username ? 'invalidInput' : ''}
            />
            <button
              type="button"
              onClick={checkUsernameAvailability}
              disabled={checkingUsername}
              className={`checkUsernameBtn ${
                checkingUsername ? 'loading' : usernameAvailable === true ? 'available' : usernameAvailable === false ? 'unavailable' : ''
              }`}
            >
              {checkingUsername ? <FaSpinner color="white" /> : usernameAvailable === null ? <FaSpinner color="white" /> : usernameAvailable ? <FaCheck color="white" /> : <FaTimes color="white" />}
            </button>
          </div>
          {warningMessage.username && <div style={{ color: 'red' }}>{warningMessage.username}</div>}
        </div>

        {/* Email */}
        <div className="formGroup">
          <label htmlFor="email" style={{ color: inputValidity.email ? 'inherit' : 'red' }}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={!inputValidity.email ? 'invalidInput' : ''}
          />
          {warningMessage.email && <div style={{ color: 'red' }}>{warningMessage.email}</div>}
        </div>

        {/* Phone Number */}
        <div className="formGroup">
          <label htmlFor="phone" style={{ color: inputValidity.phone ? 'inherit' : 'red' }}>
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={!inputValidity.phone ? 'invalidInput' : ''}
          />
          {warningMessage.phone && <div style={{ color: 'red' }}>{warningMessage.phone}</div>}
        </div>

        {/* Password */}
        <div className="formGroup">
          <label htmlFor="password" style={{ color: inputValidity.password ? 'inherit' : 'red' }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={!inputValidity.password ? 'invalidInput' : ''}
          />
          {warningMessage.password && <div style={{ color: 'red' }}>{warningMessage.password}</div>}
        </div>

        <button type="submit">Sign Up</button>
      </form>
      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
};

export default SignUp;
