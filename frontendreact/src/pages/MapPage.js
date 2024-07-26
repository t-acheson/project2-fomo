import React, { useState, useEffect } from 'react';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import BaseMap from '../components/map/BaseMap';
import UserMarker from '../components/map/UserMarker';
import TaxiZoneGeoJSON from '../components/map/TaxiZoneGeoJSON';
import geoLocation from '../data/FOMOTaxiMap';
import TaxiZoneInfoBox from '../components/map/TaxiZoneInfoBox';
import LegendControl from '../components/map/BusynessLegend'; 





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
        <div>
        <TaxiZoneInfoBox hoverInfo={hoverInfo}/>
        {/* <TaxiZonePopup /> */}
        <LegendControl />
        </div>
      </BaseMap>
    </div>
  );
}

export default MapPage;
