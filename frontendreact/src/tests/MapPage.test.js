import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapPage from '../pages/MapPage';
import { LoadScript, GoogleMap } from '@react-google-maps/api';

// Mock the LoadScript and GoogleMap components
jest.mock('@react-google-maps/api', () => ({
  LoadScript: ({ children }) => <div>{children}</div>,
  GoogleMap: ({ mapContainerStyle }) => (
    <div data-testid="google-map" style={mapContainerStyle}></div>
  )
}));

describe('MapPage', () => {
  beforeEach(() => {
    render(<MapPage />);
  });

  it('renders without crashing', () => {});

  it('renders the Google Map', () => {
    const googleMapElement = screen.getByTestId('google-map');
    expect(googleMapElement).toBeInTheDocument();
  });
});

