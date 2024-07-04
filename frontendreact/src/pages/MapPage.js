import React from 'react';
import { useContext } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { LocationContext } from '../App'; // import LocationContext
import TestLocationButton from '../components/mapFeatures/TestLocationButton';
import UserLocationMarker from '../components/mapFeatures/userLocationMarker';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const mapContainerStyle = {
  width: '100%',
  height: '80vh'
};
const center = {
  lat: 40.7128,
  lng: -74.0060
};
const mapOptions = {
  streetViewControl: false, // disable street view
};

function MapPage() {
  // store the user's location in the `userPosition` variable
  const userPosition = useContext(LocationContext);
  return (
    <div>
      <main>
        <div>
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={userPosition || center} // center the map at the user's location if available, otherwise center it at the default location
              // So in the development process,if we do not fake location in the console,the center will be in Dublin.
              zoom={10}
              options={mapOptions}
            >
              // pass the `userPosition` variable to the `UserLocationMarker` component and render a marker at the user's location
              <UserLocationMarker position={userPosition} />
            </GoogleMap>
          </LoadScript>
        </div>
      </main>
      <TestLocationButton />
    </div>
  );
}

export default MapPage;
