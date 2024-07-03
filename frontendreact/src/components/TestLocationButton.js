// this component is a button that when clicked will log the current location to the console
// it can be an example of how to use the `useContext` hook to access the location state from the `LocationContext` context
import React, { useContext } from 'react';

//make sure to import the `LocationContext` context 
import { LocationContext } from '../App';  

function TestLocationButton() {
  //use the `useContext` hook to access the location state from the `LocationContext` context
  const location = useContext(LocationContext);

  const handleClick = () => {
    console.log('Current location:', location);
  };

  return (
    <button onClick={handleClick}>Test Location</button>
  );
}

export default TestLocationButton;
