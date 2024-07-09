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
                fillColor: '#FBD3C',
                fillOpacity: 0.2,
                weight: 1.5,
                opacity: 1,
                dashArray: 3,
                color: '#403A3A'
              }}

              eventHandlers={{
                //For mouse hoover.
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    dashArray: "",
                    fillColor: "#D35400",
                    fillOpacity: 0.7,
                    weight: 2,
                    opacity: 1,
                    color: '#6E2C00',
                  })
                },
                //Revert geoJSON layer to previous state.
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    fillColor: '#FBD3C',
                    fillOpacity: 0.2,
                    weight: 1.5,
                    opacity: 1,
                    dashArray: 3,
                    color: '#403A3A'
                  });
                },

                click: (e) => {
                
                }
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
