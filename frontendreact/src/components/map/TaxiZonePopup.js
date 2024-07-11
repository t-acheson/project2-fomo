import React from 'react';

const TaxiZonePopup = ({ info, onClose }) => {
  return (
    <div className="popup-box">
      <button onClick={onClose}>Close</button>
      <h3>Details for Location ID: {info.location_id}</h3>
      <p>Busyness Level: {info.busyness}</p>
    </div>
  );
};

export default TaxiZonePopup;
