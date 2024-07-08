import React from 'react';
import BaseMap from '../components/map/BaseMap';
import UserMarker from '../components/map/UserMarker';
import GeoJSONLayer from '../components/map/GeoJSONLayer';
import TestLocationButton from '../components/map/TestLocationButton';

function MapPage() {
  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <BaseMap>
        <UserMarker />
        <GeoJSONLayer />
        {/* more layer or controller */}
      </BaseMap>
      <TestLocationButton />
    </div>
  );
}

export default MapPage;
