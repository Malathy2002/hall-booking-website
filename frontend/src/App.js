import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';  // Changed from SearchPage
import HallDetails from './pages/HallDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />  {/* Use SearchResults */}
          <Route path="/hall/:id" element={<HallDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;