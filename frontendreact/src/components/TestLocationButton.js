import React, { useContext } from 'react';
import { LocationContext } from '../App';  

function TestLocationButton() {
  const location = useContext(LocationContext);

  const handleClick = () => {
    console.log('Current location:', location);
  };

  return (
    <button onClick={handleClick}>Test Location</button>
  );
}

export default TestLocationButton;
