import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../Styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Use navigate for redirection

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await axios.post('http://localhost:5000/login', formData);
        console.log(response)
        if (response.data.success) {
          navigate('/');
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        console.error('Error logging in:', error);
        setMessage('Error logging in');
      }
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
        <h2>Login</h2>
        
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
        
        {message && <p className="error">{message}</p>}
        
        <button type="submit" className="auth-button">Login</button>
        <p className='auth-p'>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
