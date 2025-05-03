import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './pages/Home';
import AircraftStatus from './pages/AircraftStatus';
import History from './pages/History';

function App() {
  return (
    <Router>
      <Navbar />
      <div className='content'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/AircraftStatus' element={<AircraftStatus />} />
          <Route path='/History' element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
