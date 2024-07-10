import React from 'react';
import BaseMap from '../components/map/BaseMap';
import UserMarker from '../components/map/UserMarker';
import TestLocationButton from '../components/map/TestLocationButton';
import TaxiZoneGeoJSON from '../components/map/TaxiZoneGeoJSON';
import geoLocation from '../data/FOMOTaxiMap';
// if needed, import style from stylefile here
// import { ... } from '../components/mapStyles';



function MapPage() {
  if (!geoLocation || !geoLocation.features) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <BaseMap>
        <UserMarker />
        <TaxiZoneGeoJSON features={geoLocation.features} />
        {/* Placeholder for future components */}
        {/* <TaxiZoneInfoBox /> */}
        {/* <TaxiZonePopup /> */}

        <TestLocationButton />
      </BaseMap>
    </div>
  );
}

export default MapPage;
