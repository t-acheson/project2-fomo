import React, { useState, useEffect } from 'react';
import BaseMap from '../components/map/BaseMap';
import UserMarker from '../components/map/UserMarker';
import TestLocationButton from '../components/map/TestLocationButton';
import TaxiZoneGeoJSON from '../components/map/TaxiZoneGeoJSON';
import geoLocation from '../data/FOMOTaxiMap';
import TaxiZoneInfoBox from '../components/map/TaxiZoneInfoBox';
import LegendControl from '../components/map/BusynessLegend'; 
// if needed, import style from stylefile here
// import { ... } from '../components/mapStyles';



function MapPage() {
  const [hoverInfo, setHoverInfo] = useState(null);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    if (geoLocation && geoLocation.features) {
      setFeatures(geoLocation.features);
    }
  }, [geoLocation]);

  if (!features.length) {
    return <div>Loading...</div>;
  }
  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <BaseMap>
        <UserMarker />
        <TaxiZoneGeoJSON features={geoLocation.features} 
        onFeatureHover={(info) => setHoverInfo(info)}/>
        {/* Placeholder for future components */}
        <TaxiZoneInfoBox hoverInfo={hoverInfo}/>
        {/* <TaxiZonePopup /> */}
        <LegendControl />
        <TestLocationButton />
      </BaseMap>
    </div>
  );
}

export default MapPage;
