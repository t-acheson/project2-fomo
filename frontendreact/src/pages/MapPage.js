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

  const defaultStyle = {
    fillColor: '#FBD3C',
    fillOpacity: 0.2,
    weight: 1.5,
    opacity: 1,
    dashArray: '3',
    color: '#4033AA'
  };

  const highlightStyle = {
    dashArray: '',
    fillColor: '#BD0026',
    fillOpacity: 0.7,
    weight: 2,
    opacity: 1,
    color: '#E6E200'
  };

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <BaseMap>
        <UserMarker />
        {geoLocation.features.map((taxizone, index) => (
          <GeoJSON
            key={index}
            data={taxizone}
            pathOptions={defaultStyle}
            onEachFeature={(feature, layer) => {
              layer.on({
                mouseover: (e) => {
                  const targetLayer = e.target;
                  targetLayer.setStyle(highlightStyle);
                },
                mouseout: (e) => {
                  const targetLayer = e.target;
                  targetLayer.setStyle(defaultStyle);
                },
                click: (e) => {
                  const targetLayer = e.target;
                  if (feature && feature.properties) {
                    const { location_id } = feature.properties;
                    console.log('Clicked location_id:', location_id);
                  } else {
                    console.error('Feature or properties not defined:', feature);
                  }
                }
              });
            }}
          />
        ))}
        <TestLocationButton />
      </BaseMap>
    </div>
  );
}

export default MapPage;