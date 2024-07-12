import React from 'react';

const TaxiZonePopup = ({ info, onClose }) => {
  const handleSendLocationId = async () => {
    try {
      const response = await fetch('/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location_id: info.location_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Server response:', data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };


  return (
    <div className="popup-box">
      <button onClick={onClose}>Close</button>
      <h3>Details for Location ID: {info.location_id}</h3>
      <p>Busyness Level: {info.busyness}</p>
    </div>
  );
};

export default TaxiZonePopup;
