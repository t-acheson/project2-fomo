// TimeLock.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const TimeLock = (WrappedComponent) => {
  return (props) => {
    const currentHour = new Date().getHours();
    console.log('Current Hour:', currentHour); // Debugging log

    const isRestrictedTime = currentHour >= 6 && currentHour < 18; 

    console.log('Is Restricted Time:', isRestrictedTime); // Debugging log

    if (isRestrictedTime) {
      alert('Access to this page is restricted between 6 AM and 6 PM. Please come back later!');
      return <Navigate to="/" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default TimeLock;
