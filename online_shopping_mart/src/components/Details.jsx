import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../Styles/Details.css';

const Details = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/product/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="details-container">
      {product && (
        <>
          <h1>{product.name}</h1>
          <div className="details-carousel">
            <Carousel>
              <div>
                <img src={`data:image/jpeg;base64,${product.frontImage}`} alt="Front view" />
              </div>
              <div>
                <img src={`data:image/jpeg;base64,${product.backImage}`} alt="Back view" />
              </div>
              <div>
                <img src={`data:image/jpeg;base64,${product.sideImage}`} alt="Side view" />
              </div>
              <div>
                <img src={`data:image/jpeg;base64,${product.extraImage}`} alt="Extra view" />
              </div>
            </Carousel>
          </div>
          <p>{product.description}</p>
          <p>Offers: {product.offers}</p>
          <p>Type: {product.type}</p>
          <p>Discount: {product.discount}</p>
          <p>Price: {product.price}</p>
          <p>Stock Left: {product.stock_left}</p>
          <p>Stock Timing: {product.stock_timing}</p>
          <p>Offer End Time: {new Date(product.offer_end_time).toLocaleString()}</p>
          <button>Buy Now</button>
          <button>Add to Cart</button>
        </>
      )}
    </div>
  );
};

export default Details;
