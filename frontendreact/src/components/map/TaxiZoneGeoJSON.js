import React from 'react';
import { GeoJSON } from 'react-leaflet';
import { defaultStyle, highlightStyle } from './mapStyle';
import { prepareHeatmapData } from './heatmap';

const TaxiZoneGeoJSON = ({ features, busynessData }) => {
  const preparedFeatures = prepareHeatmapData(features, busynessData);

  return preparedFeatures.map((taxizone, index) => (
    <GeoJSON
      key={index}
      data={taxizone}
      pathOptions={{ ...defaultStyle, fillColor: taxizone.properties.fillColor }}
      onEachFeature={(feature, layer) => {
        layer.on({
          mouseover: (e) => {
            const targetLayer = e.target;
            targetLayer.setStyle({ ...highlightStyle, fillColor: feature.properties.fillColor });
          },
          mouseout: (e) => {
            const targetLayer = e.target;
            targetLayer.setStyle({ ...defaultStyle, fillColor: feature.properties.fillColor });
          },
          click: (e) => {
            console.log('Clicked location_id:', feature.properties.location_id);
          }
        });
      }}
    />
  ));
};

export default TaxiZoneGeoJSON;