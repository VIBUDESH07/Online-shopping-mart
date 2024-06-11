import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/AddProduct.css'; // Import the CSS file

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    offers: '',
    type: '',
    discount: '',
    price: '',
    stock_left: '',
    stock_timing: '',
    offer_end_time: '', // Add offer_end_time field
    frontImage: null, // Add front view image
    backImage: null, // Add back view image
    sideImage: null, // Add side view image
    extraImage: null // Add extra view image
  });

  const handleChange = e => {
    if (e.target.type === 'file') {
      const { name, files } = e.target;
      setProduct({ ...product, [name]: files[0] });
    } else {
      const { name, value } = e.target;
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      // Append other product details to FormData
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('offers', product.offers);
      formData.append('type', product.type);
      formData.append('discount', product.discount);
      formData.append('price', product.price);
      formData.append('stock_left', product.stock_left);
      formData.append('stock_timing', product.stock_timing);
      formData.append('offer_end_time', product.offer_end_time); // Append offer_end_time
      // Append image files to FormData
      formData.append('frontImage', product.frontImage);
      formData.append('backImage', product.backImage);
      formData.append('sideImage', product.sideImage);
      formData.append('extraImage', product.extraImage);

      await axios.post('http://localhost:5000/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Product added successfully');
      setProduct({
        name: '',
        description: '',
        type: '',
        offers: '',
        discount: '',
        price: '',
        stock_left: '',
        stock_timing: '',
        offer_end_time: '', // Reset offer_end_time
        frontImage: null,
        backImage: null,
        sideImage: null,
        extraImage: null
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={product.description} onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label>Offers:</label>
          <input type="text" name="offers" value={product.offers} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Type:</label>
          <input type="text" name="type" value={product.type} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Discount:</label>
          <input type="text" name="discount" value={product.discount} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input type="text" name="price" value={product.price} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Stock Left:</label>
          <input type="text" name="stock_left" value={product.stock_left} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Stock Timing:</label>
          <input type="text" name="stock_timing" value={product.stock_timing} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Offer End Time:</label>
          <input type="datetime-local" name="offer_end_time" value={product.offer_end_time} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Front View Image:</label>
          <input type="file" name="frontImage" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Back View Image:</label>
          <input type="file" name="backImage" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Side View Image:</label>
          <input type="file" name="sideImage" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Extra View Image:</label>
          <input type="file" name="extraImage" onChange={handleChange} />
        </div>
        <div className="button-container">
          <button type="submit">Add Product</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
