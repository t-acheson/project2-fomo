// src/tests/UserMarker.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import UserMarker from '../components/map/UserMarker'; 
import { LocationContext } from '../App'; 

// Mock Leaflet components
jest.mock('react-leaflet', () => ({
  Marker: ({ children }) => <div>{children}</div>,
  Popup: ({ children }) => <div>{children}</div>,
}));

describe('UserMarker', () => {
  test('renders a Marker and Popup when userPosition is provided', () => {
    const mockPosition = { lat: 40.7128, lng: -74.0060 }; // Example coordinates

    render(
      <LocationContext.Provider value={mockPosition}>
        <UserMarker />
      </LocationContext.Provider>
    );

    // Check if the Marker and Popup components are rendered
    expect(screen.getByText('You are here!')).toBeInTheDocument();
  });

  test('does not render Marker or Popup when userPosition is not provided', () => {
    render(
      <LocationContext.Provider value={null}>
        <UserMarker />
      </LocationContext.Provider>
    );

    // Check that no Marker or Popup is rendered
    const markerPopup = screen.queryByText('You are here!');
    expect(markerPopup).toBeNull();
  });
});
