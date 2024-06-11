import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faMapMarkerAlt, faFingerprint, faKey, faSms } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../Styles/Auth.css';
import logo1 from '../pics/logo.svg'
const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    upiId: '',
    pin: ''
  });

  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    if (isOtpSent) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOtpSent]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const validate = () => {
    const errors = {};
    if (!formData.username) errors.username = 'Username is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.upiId) errors.upiId = 'UPI ID is required';
    if (!formData.pin) errors.pin = 'PIN is required';
    return errors;
  };

  const handleOtpRequest = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await axios.post('http://localhost:5000/request-otp', { email: formData.email });
        if (response.data.success) {
          setIsOtpSent(true);
          setMessage('OTP sent successfully');
        }
      } catch (error) {
        console.error('Error requesting OTP:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signup', { ...formData, otp });
      if (response.data.success) {
        setSignupSuccess(true);
        setMessage('Welcome to Flipkart!');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setMessage('Error registering user');
    }
  };

  return (
    <div className="auth-container">
      {message && <div className={`message-container ${isOtpSent ? 'otp-message' : ''}`}>{message}</div>}
      {!signupSuccess && (
        <form className="auth-form" onSubmit={isOtpSent ? handleSubmit : handleOtpRequest}>
          <h2>Sign Up</h2>
          
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faUser} /> Username
            </label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>
          
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faEnvelope} /> Email
            </label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faLock} /> Password
            </label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faLock} /> Confirm Password
            </label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>
          
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Address
            </label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
            {errors.address && <p className="error">{errors.address}</p>}
          </div>
          
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faFingerprint} /> UPI ID
            </label>
            <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} />
            {errors.upiId && <p className="error">{errors.upiId}</p>}
          </div>
          
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faKey} /> PIN
            </label>
            <input type="text" name="pin" value={formData.pin} onChange={handleChange} />
            {errors.pin && <p className="error">{errors.pin}</p>}
          </div>
          
          {isOtpSent && (
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faSms} /> OTP
              </label>
              <input type="text" name="otp" value={otp} onChange={handleOtpChange} />
            </div>
          )}

          <button type="submit" className="auth-button">{isOtpSent ? 'Complete Sign Up' : 'Get OTP'}</button>
          <p className='auth-p'>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      )}
      {signupSuccess && (
        <div className="welcome-container">
          <h1>Welcome to Flipkart!</h1>
          <img src={logo1} className='logo-img'></img>
          <div className="fireworks">
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
