import React from 'react';
import BaseMap from '../components/map/BaseMap';
import UserMarker from '../components/map/UserMarker';
// import GeoJSONLayer from '../components/map/GeoJSONLayer';
import TestLocationButton from '../components/map/TestLocationButton';
import geoLocation from '../data/FOMOTaxiMap';
import {GeoJSON} from 'react-leaflet'

console.log('geoLocation:', geoLocation);

function MapPage() {
  if (!geoLocation || !geoLocation.features) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <BaseMap>
        <UserMarker />
        {geoLocation.features.map((taxizone, index) => {
          const coordinates = taxizone.geometry.coordinates;
          return (
            <GeoJSON
              key={index}
              data={taxizone}
              pathOptions={{
                // fillColor: '#FBD3C',
                // fillOpacity: 0.1,
                weight: 1.5,
                opacity: 1,
                dashArray: 3,
                color: 'black'
              }}
            />
          );
        })}
        <TestLocationButton />
      </BaseMap>
    </div>
  );
}

export default MapPage;
