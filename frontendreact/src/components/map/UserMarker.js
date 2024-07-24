import React from 'react';
import { Marker, Popup } from 'react-leaflet';

// commented out because we are not in NY right now
import { useContext } from 'react';
import { LocationContext } from '../../App';

const UserMarker = () => {
  const userPosition = useContext(LocationContext);

  return (
    userPosition ? (
      <Marker position={[userPosition.lat, userPosition.lng]}>
        <Popup>You are here!</Popup>
      </Marker>
    ) : null
  );
};

export default UserMarker;



