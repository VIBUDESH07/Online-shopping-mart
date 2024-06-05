import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import '../Styles/ProductList.css'

const ProductList = ({ type, products }) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  // Example useEffect hook to demonstrate how to use props
  useEffect(() => {
    console.log('Type:', type); // Accessing the type prop
  }, [type]);

  return (
    <div className='product-container'>
      <div className='product-header'>
        <h1>{type} List</h1>
        <Link to={`/products/${type}`} className="view-more-button">
          <FontAwesomeIcon icon={showMore ? faArrowUp : faArrowDown} />
        </Link>
      </div>
      <div className={`product-grid ${showMore ? 'show-more' : ''}`}>
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const offerEndTime = new Date(product.offer_end_time);
      const difference = offerEndTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('Offer expired');
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [product.offer_end_time]);

  return (
    <Link to={`/product/${product._id}`} className='product-card-link'>
      <div className='product-card'>
        <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name || 'Default Image'} className='product-image' />
        <div className='product-info'>
          <h3 className='product-title'>{product.name}</h3>
          <p>{product.description}</p>
          <div className='product-pricing'>
            <p className='product-original-price'>Rs.{product.price}</p>
            <p className='product-discount-price'>Rs.{product.discount}</p>
          </div>
          {product.offer_end_time && (
            <p className='product-offer-timing'>Offer ends in: {timeLeft}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductList;
