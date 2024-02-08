import React from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css'; // Make sure the CSS file is updated if necessary

const SignUp = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");
    // Here, you'll handle the form submission, e.g., sending data to a backend.
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
          <input type="text" id="fullName" name="fullName" required />
        </div>
        <div className="formGroup">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="formGroup">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" required pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
          <small>Format: 123-456-7890</small>
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
};

export default SignUp;
