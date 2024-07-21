import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import '../cssFiles/popUpBox.css'

const TaxiZoneInfoBox = ({ hoverInfo }) => {
  const map = useMap();

  // this hook creates a new Leaflet control 
  useEffect(() => {
    const info = L.control({ position: 'topright' });

    // creates 'div' element with class of 'info' and calls update to set its initial content.
    info.onAdd = function () {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };
    // return the div element used as the container for the control.

    // calls the update method of the control to set the initial content of the div.
    info.update = function (props) {
      this._div.innerHTML = '<h4>New York Zones</h4>' + (props
        ? '<b>' + props.zone + '</b><br />Busyness: ' + props.busyness
        : 'Hover over a zone');
    };
    // returns an updated content of the div based on the passed properties

    info.addTo(map);

    // Store the info control in the component instance for later updates
    map.infoControl = info;

    return () => {
      map.removeControl(info);
    };
  }, [map]);

  useEffect(() => {
    if (map.infoControl) {
      map.infoControl.update(hoverInfo);
    }
  }, [hoverInfo, map]);

  return null;
};

export default TaxiZoneInfoBox;
