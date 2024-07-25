import React from 'react';
import { createContext, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MapPage from './pages/MapPage';
import HomePage from './pages/HomePage';
import FeedPage from './pages/FeedPage';
import NotificationPage from './pages/NotificationPage';
import Header from './components/header';
import Footer from './components/footer';
import './App.css'
import { sendLocation } from './hooks/webSocket';
import TimeLock from './components/TimeLock';
import getFingerprint from './hooks/fingerprint';

// create a context for the location state
export const LocationContext = createContext(null);

const TimeLockedMapPage = TimeLock(MapPage);
const TimeLockedFeedPage = TimeLock(FeedPage);

function App() {
 // create a location state
  const [location, setLocation] = useState(null);
// use the `useEffect` hook to get the user's location
//! to uncode for actual user location
  // useEffect(() => {
  //   const getLocation = () => {
  //     if (navigator.geolocation) {
  //       // get the user's location using the Geolocation API
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           const userLocation = {
  //             lat: position.coords.latitude,
  //             lng: position.coords.longitude
  //           };
  //           setLocation(userLocation);  
  //         },
  //         (error) => {
  //           console.error('Access to location denied:', error);
  //           setLocation(null);  
  //         }
  //       );
  //     }
  //   };
  //   // call the `getLocation` function when the component mounts
  //   getLocation();  
  // }, []);

  // use the `useEffect` hook to set the user's location
  //* testing use effect start
  useEffect(() => {
    const hardcodedLocation = {
      lat: 40.6478277863495,
      lng: -73.98422384354889
    };
    setLocation(hardcodedLocation);

    // Retrieve the fingerprint and send it along with the location
    getFingerprint().then(fingerprint => {
      sendLocation({ ...hardcodedLocation, fingerprint });
    });
  }, []);
//* testing use effect start


  return (
    <LocationContext.Provider value={location}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Uncomment below code for full time access */} 
          <Route path="/map" element={<MapPage />} />
          <Route path="/feed" element={<FeedPage />} /> 

          {/* Comment below 2 lines of code for restricted time access */} 
          {/* <Route path="/map" element={<TimeLockedMapPage />} />  */}
          {/* <Route path="/feed" element={<TimeLockedFeedPage />} />  */}

          {/* <Route path="/notification" element={<NotificationPage />} /> */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </Router>
    </LocationContext.Provider>
  );
}

export default App;
