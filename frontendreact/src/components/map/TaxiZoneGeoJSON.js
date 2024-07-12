import React from 'react';
import { GeoJSON } from 'react-leaflet';
import { defaultStyle, highlightStyle } from './mapStyle';
import { prepareHeatmapData } from './heatmap';

const TaxiZoneGeoJSON = ({ features, onFeatureHover }) => {
  const preparedFeatures = prepareHeatmapData(features);

  const handleClick = (location_id) => {
    // HTTP POST request to send location_id to the Go server
    fetch('/location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location_id }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response from server:', data);
        // Handle the response as needed
      })
      .catch(error => {
        console.error('Error sending location_id to server:', error);
      });
  };

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
            if (onFeatureHover) {
              onFeatureHover(feature.properties);
            }
          },
          mouseout: (e) => {
            const targetLayer = e.target;
            targetLayer.setStyle({ ...defaultStyle, fillColor: feature.properties.fillColor });
            if (onFeatureHover) {
              onFeatureHover(null);
            }
          },
          click: (e) => {
            console.log('Clicked location_id:', feature.properties.location_id);
            const comment = "Top comment for this zone.";
            layer.bindPopup(comment).openPopup();

            // Call handleClick function to send location_id to the server
            handleClick(feature.properties.location_id);
          }
        });
      }}
    />
  ));
};

export default TaxiZoneGeoJSON;