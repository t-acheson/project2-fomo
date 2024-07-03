import React from 'react';
import Button from 'react-bootstrap/Button';

const GetLocationButton = () => {
        const [location, setLocation] = React.useState(null);
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
        console.log(location);
    };

    return (
        <Button onClick={handleGetLocation} variant="primary">
            Activate
            <i className="fas fa-chevron-right"></i>
        </Button>
    );
};

export default GetLocationButton;
