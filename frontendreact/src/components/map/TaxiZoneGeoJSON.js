import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { defaultStyle, highlightStyle } from './mapStyle';
import { prepareHeatmapData } from './heatmap';

const TaxiZoneGeoJSON = ({ features, onFeatureHover }) => {
  const [preparedFeatures, setPreparedFeatures] = useState([]);
  const [popupContent, setPopupContent] = useState(null); // Define popupContent state


  useEffect(() => {
    const fetchAndPrepareData = async () => {
      const data = await prepareHeatmapData(features);
      setPreparedFeatures(data);
    };

    fetchAndPrepareData();
  }, [features]);

  const fetchTopComment = async (lat, lng) => {
      console.log('Fetching top comment for lat:', lat, 'lng:', lng);
      try {
          const response = await fetch(`/api/top-comment?lat=${lat}&lng=${lng}`);
          if (response.ok) {
              const data = await response.json();
              if (data.comment) {
                  setPopupContent(data.comment); // Update the state
                  return data.comment; // Return the comment
              } else {
                  console.log('No comments found in this area');
                  return 'No comments found in this area'; // Return the no comment message
              }
          } else {
              console.log('Failed to fetch top comment');
              return 'No comments found in this area'; // Fallback content
          }
      } catch (error) {
          console.error('Failed to fetch top comment', error);
          return 'Error fetching comment'; // Error message
      }
  }


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
          click: async (e) => {
            console.log(e);
            const { lat, lng } = e.latlng;
            console.log('Clicked lat:', lat, 'lng:', lng);
            const comment = await fetchTopComment(lat, lng); // Await fetching top comment
            layer.bindPopup(comment).openPopup(); // Bind and open the popup with fetched content
          }
        });
      }}
    />
  ));
};

export default TaxiZoneGeoJSON;