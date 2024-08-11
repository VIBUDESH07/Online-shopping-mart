// HeaderTop.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUser, faStore, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import main from '../pics/logo.svg';
import '../Styles/Header.css';

const HeaderTop = ({ searchQuery, handleSearchChange }) => {
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
        <Link to="/login" className="login-button">
          <FontAwesomeIcon icon={faUser} /> Login
        </Link>
      </div>
      <div className="head-button-container">
        <Link to="/cart" className="cart-button">
          <FontAwesomeIcon icon={faShoppingCart} /> Cart
        </Link>
      </div>
      <div className="head-button-container">
        <Link to="/seller" className="seller-button">
          <FontAwesomeIcon icon={faStore} /> Become a Seller
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

export default HeaderTop;
