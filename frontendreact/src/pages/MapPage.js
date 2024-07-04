import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const mapContainerStyle = {
  width: '100%',
  height: '400px'
};
const center = {
  lat: 40.7128,
  lng: -74.0060
};

function MapPage() {
  return (
    <div>
      <main>
        <div>
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={10}
            >
              {/* Other components such as markers */}
            </GoogleMap>
          </LoadScript>
        </div>
      </main>
    </div>
  );
}

export default MapPage;
