import React from 'react';
import { GeoJSON } from 'react-leaflet';
import geojsonData from '../../data/NYC Taxi Zones.geojson'; 


const GeoJSONLayer = () => {
  return <GeoJSON data={geojsonData} />;
};

export default GeoJSONLayer;
