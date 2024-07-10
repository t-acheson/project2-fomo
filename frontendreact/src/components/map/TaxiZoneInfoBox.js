import React from 'react';

const TaxiZoneInfoBox = ({ info }) => {
  return (
    <div className="info-box">
      <p>Location ID: {info.location_id}</p>
      <p>Busyness: {info.busyness}</p>
    </div>
  );
};

export default TaxiZoneInfoBox;
