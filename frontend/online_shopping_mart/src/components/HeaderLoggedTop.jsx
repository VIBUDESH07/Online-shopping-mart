// HeaderLoggedTop.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faStore, faEllipsisV, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import main from '../pics/logo.svg';
import '../Styles/Header.css';

const HeaderLoggedTop = ({ searchQuery, handleSearchChange }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from local storage or context
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn'); // Example: remove user data from local storage
    // Perform any other logout actions needed

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className='head-home'>
      <div>
        <img src={main} className='head-logo' alt="Logo" />
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </div>
      <div className="head-button-container">
        <Link to="/cart" className="cart-button">
          <FontAwesomeIcon icon={faShoppingCart} /> Cart
        </Link>
      </div>
      <div className="head-button-container">
        <Link to="/orders" className="cart-button">
          <FontAwesomeIcon icon={faStore} /> My Orders
        </Link>
      </div>
      <div className="head-button-container">
        <Link to="/menu" className="menu-button">
          <FontAwesomeIcon icon={faEllipsisV} />
        </Link>
      </div>
 
    </div>
  );
};

export default HeaderLoggedTop;
