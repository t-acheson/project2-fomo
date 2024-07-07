import React from 'react';
import { Marker } from '@react-google-maps/api';

// receive the `position` prop from the context
const UserLocationMarker = ({ position }) => {
    if (!position) {
        return null;  
    }
    return <Marker position={position} />;
};

export default UserLocationMarker;

