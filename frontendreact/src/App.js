import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MapPage from './pages/MapPage';
import FeedPage from './pages/FeedPage';
import NotificationPage from './pages/NotificationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
