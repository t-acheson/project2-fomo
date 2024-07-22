import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { defaultStyle, highlightStyle } from './mapStyle';
import { prepareHeatmapData } from './heatmap';

const TaxiZoneGeoJSON = ({ features, onFeatureHover }) => {
  const [preparedFeatures, setPreparedFeatures] = useState([]);
  const [popupContent, setPopupContent] = useState(''); // Define popupContent state


  useEffect(() => {
    const fetchAndPrepareData = async () => {
      const data = await prepareHeatmapData(features);
      setPreparedFeatures(data);
    };

    fetchAndPrepareData();
  }, [features]);

  const fetchTopComment = async(lat, lng) => {
    try {
      const response = await fetch(`/api/top-comment?lat=${lat}&lng=${lng}`);
      if (response.ok) {
        const data = await response.json();
        setPopupContent(data.comment);
      } else {
        const errorText = await response.text();
        console.log('Failed to fetch top comment:', response.status, errorText);
      }
    } catch (error) {
      console.error('Failed to fetch top comment', error);
    }
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
            const { lat, lng } = e.latlng;
            console.log('Clicked lat:', lat, 'lng:', lng);
            fetchTopComment(lat, lng);
            layer.bindPopup(popupContent).openPopup();
          }
        });
      }}
    />
  ));
};

export default TaxiZoneGeoJSON;