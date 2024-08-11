// Header.js
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
import ProductListPage from './ProductList'; // Import the new component

const Header = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(response => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.discount.toString().includes(searchQuery)||
    product.description.toString().includes(searchQuery.toLowerCase())
  );

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.type]) {
      acc[product.type] = [];
    }
    acc[product.type].push(product);
    return acc;
  }, {});

  return (
    <div>
      
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
          interval={2000}
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
      {Object.entries(groupedProducts).map(([type, products]) => (
        <div key={type}>
          <ProductListPage type={type} products={products.slice(0, 4)} />
        </div>
      ))}
    </div>
  );
};

export default Header;
