import React from 'react';
import { GeoJSON } from 'react-leaflet';
import { defaultStyle, highlightStyle } from './mapStyle';

const TaxiZoneGeoJSON = ({ features }) => {
  return features.map((taxizone, index) => (
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
            console.log('Clicked location_id:', feature.properties.location_id);
          }
        });
      }}
    />
  ));
};

export default TaxiZoneGeoJSON;
