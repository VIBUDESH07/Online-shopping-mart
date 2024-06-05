// App.js
import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import Product from './components/Product';

function App() {
  return (
    <Routes>
      {/* Route to the Header component */}
      <Route path="/" element={<Header />} />

      {/* Route to the AddProduct component */}
      <Route path="/add" element={<AddProduct />} />

      {/* Route to the ProductList component with dynamic type */}
      <Route path="/products/:type" element={<ProductRoute />} />
    </Routes>
  );
}

// Nested Route to handle dynamic routing and pass props to the Product component
function ProductRoute() {
  const { type } = useParams();
  return <Product type={type} />;
}

export default App;
