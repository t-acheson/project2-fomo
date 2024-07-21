import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { getHeatmapColor,getBusynessDescription } from './heatmap';

const LegendControl = () => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      const grades = [0.8, 0.6, 0.4, 0.2, 0];
      const labels = [];

      div.innerHTML += '<h4>Busyness Scale</h4>';

      // Loop through busyness intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getHeatmapColor(grades[i]) + '"></i> ' +
          getBusynessDescription(grades[i]) + '<br>';
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


