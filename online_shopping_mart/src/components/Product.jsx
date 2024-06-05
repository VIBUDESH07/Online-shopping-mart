import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Product.css'
const Product = ({ type }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/product_specific/${type}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [type]);

  const calculateTimeLeft = (offerEndTime) => {
    const now = new Date();
    const offerEndTimeDate = new Date(offerEndTime);
    const difference = offerEndTimeDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      return 'Offer expired';
    }
  };

  return (
    <div>
      <h2>Products of type: {type}</h2>
      <div className="s-product-container">
        {products.map(product => (
          <Link to={`/product/${product._id}`} className='s-product-card-link' key={product._id}>
            <div className='s-product-card'>
              <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name || 'Default Image'} className='s-product-image' />
              <div className='s-product-info'>
                <h3 className='s-product-title'>{product.name}</h3>
                <p>{product.description}</p>
                <div className='s-product-pricing'>
                  <p className='s-product-original-price'>Rs.{product.price}</p>
                  <p className='s-product-discount-price'>Rs.{product.discount}</p>
                </div>
                {product.offer_end_time && (
                  <p className='s-product-offer-timing'>Offer ends in: {calculateTimeLeft(product.offer_end_time)}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Product;
