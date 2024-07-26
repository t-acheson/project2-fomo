import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapPage from '../pages/MapPage';

// Assuming BaseMap, UserMarker, and TestLocationButton are properly exported and can be mocked if needed
jest.mock('../components/map/BaseMap', () => () => <div data-testid="base-map"></div>);
jest.mock('../components/map/UserMarker', () => () => <div data-testid="user-marker"></div>);
jest.mock('../components/map/TestLocationButton', () => () => <div data-testid="test-location-button"></div>);



describe('MapPage', () => {
  beforeEach(() => {
    render(<MapPage />); // Render the MapPage component before each test
  });

  it('renders without crashing', () => {
    const baseMapElement = screen.getByTestId('base-map');
    expect(baseMapElement).toBeInTheDocument();
  });

  it('renders the BaseMap component', () => {
    const baseMapElement = screen.getByTestId('base-map');
    expect(baseMapElement).toBeInTheDocument();
  });

  // it('renders the UserMarker component', () => {
  //   const userMarkerElement = screen.getByTestId('user-marker');
  //   expect(userMarkerElement).toBeInTheDocument();
  // });

  // it('renders the TestLocationButton component', () => {
  //   const testLocationButtonElement = screen.getByTestId('test-location-button');
  //   expect(testLocationButtonElement).toBeInTheDocument();
  // });
});

