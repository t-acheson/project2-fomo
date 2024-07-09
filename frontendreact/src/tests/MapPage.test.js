import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapPage from '../pages/MapPage';
import { LoadScript, GoogleMap } from '@react-google-maps/api';

// Mock the LoadScript and GoogleMap components
jest.mock('@react-google-maps/api', () => ({
  LoadScript: ({ children }) => <div>{children}</div>, // Mocked LoadScript component
  GoogleMap: ({ mapContainerStyle }) => (
    <div data-testid="google-map" style={mapContainerStyle}></div> // Mocked GoogleMap component
  )
}));

describe('MapPage', () => {
  beforeEach(() => {
    render(<MapPage />); // Render the MapPage component before each test
  });

  it('renders without crashing', () => {
    // Test case to check if the MapPage component renders without crashing
  });

  it('renders the Google Map', () => {
    const googleMapElement = screen.getByTestId('google-map'); // Get the GoogleMap element by its test id
    expect(googleMapElement).toBeInTheDocument(); // Assert that the GoogleMap element is in the document
  });
});

