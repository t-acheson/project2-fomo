import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { defaultStyle, highlightStyle } from './mapStyle';
import { prepareHeatmapData } from './heatmap';

const TaxiZoneGeoJSON = ({ features, onFeatureHover }) => {
  const [preparedFeatures, setPreparedFeatures] = useState([]);

  useEffect(() => {
    const fetchAndPrepareData = async () => {
      const data = await prepareHeatmapData(features);
      setPreparedFeatures(data);
    };

    fetchAndPrepareData();
  }, [features]);

  //TODO need to change from location_id to lat lng
  const fetchTopComment = async(location_id) => {
    try{
      const response = await fetch(`/api/top-comment?location_id=${2,2}`); //2,2 lat lng current hard coded in need to get user click lat lng instead 
      if (response.ok) {
        const data = await response.json();
        setPopupContent(data.comment);
      } else {
        console.log('Failed to fetch top comment');
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
            console.log('Clicked location_id:', feature.properties.location_id);
            fetchTopComment(feature.properties.location_id);
            layer.bindPopup(comment).openPopup();
          }
        });
      }}
    />
  ));
};

export default TaxiZoneGeoJSON;