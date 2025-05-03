import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, {useState} from 'react';
import Navbar from './components/navbar/Navbar';
import Home from './pages/Homepage/Home';
import AircraftStatus from './pages/AircraftStatus';
import History from './pages/History';
import Login from './pages/Login/Login';

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <Router>
      <Navbar isFullscreen={ isFullscreen } />
      <div className='content'>
        <Routes>
          <Route path='/' element={<Home isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen}/>} />
          <Route path='/AircraftStatus' element={<AircraftStatus />} />
          <Route path='/History' element={<History />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
