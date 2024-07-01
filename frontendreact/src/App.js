import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MapPage from './pages/MapPage';
import HomePage from './pages/HomePage';
import FeedPage from './pages/FeedPage';
import NotificationPage from './pages/NotificationPage';
import Header from './components/header';
import Footer from './components/footer';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/items')
    .then(Response => Response.json())
    .then(data => setItems(data));
  },[]);


  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
