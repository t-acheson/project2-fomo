import React, { useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../cssFiles/baseMap.css';  

const DEFAULT_CENTER = { lat: 40.6428, lng: -74.0060 };
const DEFAULT_ZOOM = 11;

const ResetButton = ({ setViewport }) => {
  const map = useMap();

  const handleReset = useCallback(() => {
    map.setView([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], DEFAULT_ZOOM);
    setViewport({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
  }, [map, setViewport]);

  return (
    <div className="reset-button-container">
      <button 
        onClick={handleReset}
        className="reset-button"
      >
        Reset
      </button>
      
    </div>
  );
};

const BaseMap = ({ children }) => {
  const [viewport, setViewport] = useState({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
  const mapRef = useRef(null);

  return (
    <MapContainer 
      center={[viewport.center.lat, viewport.center.lng]} 
      zoom={viewport.zoom} 
      className="map-container"
      ref={mapRef}
      whenCreated={(map) => {
        mapRef.current = map;
      }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <ResetButton setViewport={setViewport} />
      {children}
    </MapContainer>
  );
};

export default BaseMap;
