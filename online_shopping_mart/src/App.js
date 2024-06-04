import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';

function App() {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Header/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
