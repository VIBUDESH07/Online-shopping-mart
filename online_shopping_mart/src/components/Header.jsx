import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gro from '../pics/grocery.webp';
import mobile from '../pics/Mobile.webp';
import travel from '../pics/travel.webp';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUser, faStore, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import '../Styles/Header.css';
import main from '../pics/logo.svg';
import logo1 from '../pics/1.webp';
import logo2 from '../pics/2.webp';
import logo3 from '../pics/3.webp';
import logo4 from '../pics/4.png';
import logo5 from '../pics/5.png';
import axios from 'axios';

const Header = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(response => {
        setProducts(response.data);
        console.log(products);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div>
      <div className='head-home'>
        <div>
          <img src={main} className='head-logo' alt="Logo" />
        </div>
        <div className="search-container">
          <input type="text" placeholder="Search..." />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        <div className="button-container">
          <Link to="/login" className="login-button">
            <FontAwesomeIcon icon={faUser} /> Login
          </Link>
        </div>
        <div className="button-container">
          <Link to="/cart" className="cart-button">
            <FontAwesomeIcon icon={faShoppingCart} /> Cart
          </Link>
        </div>
        <div className="button-container">
          <Link to="/seller" className="seller-button">
            <FontAwesomeIcon icon={faStore} /> Become a Seller
          </Link>
        </div>
        <div className="button-container">
          <Link to="/menu" className="menu-button">
            <FontAwesomeIcon icon={faEllipsisV} />
          </Link>
        </div>
      </div>
      <div className='head-nav'>
        <div className='head-img'>       
          <Link to="/grocery">
            <img src={gro} alt="Grocery" />
            <p className='head-p'>Grocery</p>
          </Link>
        </div>
        <div className='head-img'>
          <Link to="/mobile">
            <img src={mobile} alt="Mobiles" />
            <p className='head-p'>Mobiles</p>
          </Link>
        </div>
        <div className='head-img'>
          <Link to="/travel">
            <img src={travel} alt="Travel" />
            <p className='head-p'>Travel</p>
          </Link>
        </div>
      </div>
      <div className='head-carousel'>
        <Carousel
          showArrows={true}
          showThumbs={false}
          showStatus={false}   
          infiniteLoop={true}
          autoPlay={true}
          interval={1500}
          stopOnHover={true}    
          transitionTime={500}
        >
          <div>
            <img src={logo1} alt="Logo 1" />
          </div>
          <div>
            <img src={logo2} alt="Logo 2" />
          </div>
          <div>
            <img src={logo3} alt="Logo 3" />
          </div>
          <div>
            <img src={logo4} alt="Logo 4" />
          </div>
          <div>
            <img src={logo5} alt="Logo 5" />
          </div>
        </Carousel>
      </div>
      <div className='product-container'>
        <h1>Product-List</h1>
        <div className='product-grid'>
          {products.map((product, index) => (
            <div key={index} className='product-card'>
              <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name || 'Default Image'} className='product-image' />
              <div className='product-info'>
                <h3 className='product-title'>{product.name}</h3>
                <p className='product-description'>{product.description}</p>
                <p className='product-price'>Rs.${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
