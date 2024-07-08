import React, { useContext } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { LocationContext } from '../../App'

const UserMarker = () => {
  const userPosition = useContext(LocationContext);
  
  return userPosition ? (
    <Marker position={[userPosition.lat, userPosition.lng]}>
      <Popup>You are here!</Popup>
    </Marker>
  ) : null;
};

export default UserMarker;
