import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import AddProduct from './components/AddProduct';

function App() {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Header/>}></Route>
      <Route path="/add" element={<AddProduct/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
// ... (other imports and code)

