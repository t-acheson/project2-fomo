const gjv = require('geojson-validation');
const fs = require('fs');

const data = fs.readFileSync('./NYC Taxi Zones.geojson', 'utf8');

const geojsonData = JSON.parse(data);

gjv.valid(geojsonData, function(valid, errs){
  if (valid) {
    console.log("GeoJSON is valid!");
  } else {
    console.log("GeoJSON is not valid:");
    console.error(errs);
  }
});
