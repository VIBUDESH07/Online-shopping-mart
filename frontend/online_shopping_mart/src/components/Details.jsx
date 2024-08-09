import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!product) {
          setLoading(true);
        }

        const response = await axios.get(`http://localhost:5000/product/${id}`);
        setProduct(response.data);

        const similarResponse = await axios.get(`http://localhost:5000/product_specific/${response.data.type}`);
        setSimilarProducts(similarResponse.data);

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

  const handleAddToCart = async () => {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

    if (!isLoggedIn) {
      alert('You need to be logged in to add items to the cart. Please log in.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/cart/add', {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1, // You can adjust this based on user input
      });
      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding product to cart:', err);
      alert('Failed to add product to cart');
    }
  };

  const handleBuyNow = async () => {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

    if (!isLoggedIn) {
      alert('You need to be logged in to proceed with the purchase. Please log in.');
      return;
    }

    // Replace with your buy now logic or redirect to checkout
    navigate(`/checkout/${product._id}`);
  };

  if (loading && !product) {
    return <div className="loading">Loading...</div>;
  }

  if (showSpinner) {
    return <div className="spinner">Loading new product...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="details-container">
      {product && (
        <>
          <h1 className="product-name">{product.name}</h1>
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
          
          <p className="product-description">{product.description}</p>
          <div className="pricing">
            <p className="original-price">₹{product.price}</p>
            <p className="discounted-price">₹{product.price - product.discount}</p>
          </div>
          <p className="offer-end-time">Offer ends: {new Date(product.offer_end_time).toLocaleString()}</p>
          <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>

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
                      <p className="product-price">Price: ₹{similarProduct.price}</p>
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
