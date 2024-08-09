import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../Styles/Details.css';

const Details = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!product) {
          setLoading(true);
        }

        const response = await axios.get(`http://localhost:5000/product/${id}`);
        setProduct(response.data);

        // Fetch similar products based on product type or category
        const similarResponse = await axios.get(`http://localhost:5000/product_specific/${response.data.type}`);
        setSimilarProducts(similarResponse.data);
        console.log(similarResponse);

        setShowSpinner(true);
        setTimeout(() => {
          setShowSpinner(false);
          setLoading(false);
          window.scrollTo(0, 0);
        }, 500); // 2 seconds delay
      } catch (err) {
        setError('Error fetching product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading && !product) {
    return <div className="loading">Loading...</div>;
  }

  if (showSpinner) {
    return <div className="spinner">Loading new product...</div>; // Customize spinner style in CSS
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
          <p style={{color:red}}>{product.description}</p>
          <p>Offers: {product.offers}</p>
          <p>Type: {product.type}</p>
          <p>Discount: {product.discount}</p>
          <p>Price: {product.price}</p>
          <p>Stock Left: {product.stock_left}</p>
          <p>Stock Timing: {product.stock_timing}</p>
          <p>Offer End Time: {new Date(product.offer_end_time).toLocaleString()}</p>
          <button>Buy Now</button>
          <button>Add to Cart</button>

          <div className="similar-products">
            <h2>Similar Products</h2>
            <div className="product-grid">
              {similarProducts.map((similarProduct) => (
                <Link to={`/product/${similarProduct._id}`} className="s-product-card-link" key={similarProduct._id}>
                  <div className="product-card">
                    <img
                      src={`data:image/jpeg;base64,${similarProduct.frontImage}`}
                      alt={similarProduct.name}
                      className="product-image"
                    />
                    <div className="product-info">
                      <h3 className="product-title">{similarProduct.name}</h3>
                      <p className="product-price">Price: {similarProduct.price}</p>
                      <button>View Details</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Details;
