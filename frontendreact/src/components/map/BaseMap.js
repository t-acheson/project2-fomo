import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const BaseMap = ({ children }) => {
  const center = { lat: 40.7128, lng: -74.0060 };
  const zoom = 10;

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '80vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {children}
    </MapContainer>
  );
};

export default BaseMap;
