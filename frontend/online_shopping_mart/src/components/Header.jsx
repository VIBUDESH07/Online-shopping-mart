import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from 'axios';
import HeaderTop from './HeaderTop';
import HeaderLoggedTop from './HeaderLoggedTop';
import ProductListPage from './ProductList';
import logo1 from '../pics/1.webp';
import logo2 from '../pics/2.webp';
import logo3 from '../pics/3.webp';
import logo4 from '../pics/4.png';
import logo5 from '../pics/5.png';
import gro from '../pics/grocery.webp';
import mobile from '../pics/Mobile.webp';
import travel from '../pics/travel.webp';

const Header = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(response => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });

    // Check login status from localStorage
    const loginStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loginStatus === 'true');
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.discount.toString().includes(searchQuery) ||
    product.description.toLowerCase().includes(searchQuery)
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
      {isLoggedIn ? (
        <HeaderLoggedTop searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      ) : (
        <HeaderTop searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      )}
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
