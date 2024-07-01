import React from 'react';
import Button from 'react-bootstrap/Button';
import { useLocation } from '../context/LocationContext'; 

const GetLocationButton = () => {
    const [location, setLocation] = useLocation(); 
    const handleGetLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                console.error('Error getting location:', error);
            },
            { enableHighAccuracy: true }
        );
    };

    return (
        <Button onClick={handleGetLocation} variant="primary">
            Activate
            <i className="fas fa-chevron-right"></i>
        </Button>
    );
};

export default GetLocationButton;
