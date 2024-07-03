import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext();


function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
}

export { LocationProvider };
export default LocationContext;