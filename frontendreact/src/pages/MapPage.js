import React from 'react';
import { useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationContext } from '../App'; // import LocationContext
import TestLocationButton from '../components/mapFeatures/TestLocationButton';

const mapContainerStyle = {
  width: '100%',
  height: '80vh'
};
const center = {
  lat: 40.7128,
  lng: -74.0060
};

function MapPage() {
  const userPosition = useContext(LocationContext);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <main>
        <MapContainer center={center} zoom={13} style={mapContainerStyle}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {userPosition && (
            <Marker position={[userPosition.lat, userPosition.lng]}>
              <Popup>You are here!</Popup>
            </Marker>
          )}
        </MapContainer>
      </main>
      <TestLocationButton />
    </div>
  );
}

export default MapPage;
