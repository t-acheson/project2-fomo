import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const LegendControl = () => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      const grades = [0, 0.25, 0.5, 0.75, 1];
      const labels = [];

      div.innerHTML += '<h4>Busyness Scale</h4>';

      // Loop through busyness intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getHeatmapColor(grades[i] + 0.01) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
    };

    legend.addTo(map);

    return () => {
      map.removeControl(legend);
    };
  }, [map]);

  return null;
};

export default LegendControl;

// Function to get the color based on busyness
const getHeatmapColor = (busyness) => {
  if (busyness >= 0.75) return '#d7301f';
  if (busyness >= 0.5) return '#fc8d59';
  if (busyness >= 0.25) return '#fdcc8a';
  return '#fef0d9';
};
// returns the colours based on busyness
