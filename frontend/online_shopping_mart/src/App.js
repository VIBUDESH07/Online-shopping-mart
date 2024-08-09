// App.js
import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import AddProduct from './components/AddProduct';
import Product from './components/Product';
import SignUp from './components/SignUp';
import Login from './authentication/Login';
import Details from './components/Details';

function App() {
  return (
    <Routes>
      {/* Route to the Header component */}
      <Route path="/" element={<Header />} />
      <Route path="/product/:id" element={<Details/>}/>
      {/* Route to the AddProduct component */}
      <Route path="/add" element={<AddProduct />} />
      <Route path="/signup" element={<SignUp />} />
    <Route path="/login" element={<Login/>}/>
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
