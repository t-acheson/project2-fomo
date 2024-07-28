const fs = require('fs');
const rewind = require('@mapbox/geojson-rewind');

// Read your GeoJSON file
const geojsonFilePath = './FOMOTaxiMap.geojson';
const geojsonData = JSON.parse(fs.readFileSync(geojsonFilePath));

// Function to check winding order
const checkWindingOrder = (coordinates) => {
  let sum = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [x1, y1] = coordinates[i];
    const [x2, y2] = coordinates[i + 1];
    sum += (x2 - x1) * (y2 + y1);
  }
  return sum > 0;
};

// Iterate through the features and fix winding order
geojsonData.features.forEach((feature) => {
  if (feature.geometry.type === 'Polygon') {
    const outerRing = feature.geometry.coordinates[0];
    if (checkWindingOrder(outerRing)) {
      feature.geometry.coordinates[0] = outerRing.reverse();
    }
  } else if (feature.geometry.type === 'MultiPolygon') {
    feature.geometry.coordinates.forEach((polygon) => {
      const outerRing = polygon[0];
      if (checkWindingOrder(outerRing)) {
        polygon[0] = outerRing.reverse();
      }
    });
  }
});

// Write the corrected GeoJSON back to a file
const outputFilePath = './FOMOTaxiMap.geojson';
fs.writeFileSync(outputFilePath, JSON.stringify(geojsonData, null, 2));

console.log('GeoJSON winding order checked and corrected!');
