import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import MapPage from '../pages/MapPage'; 

jest.mock('../components/map/BaseMap', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/map/UserMarker', () => () => <div>UserMarker Component</div>);
jest.mock('../components/map/TaxiZoneGeoJSON', () => ({ features, onFeatureHover }) => (
  <div>
    TaxiZoneGeoJSON Component
    {features.map((feature, index) => (
      <div key={index}>{feature.name}</div>
    ))}
  </div>
));
jest.mock('../components/map/TaxiZoneInfoBox', () => ({ hoverInfo }) => (
  <div>{hoverInfo ? hoverInfo.name : 'No Hover Info'}</div>
));
jest.mock('../components/map/BusynessLegend', () => () => <div>LegendControl Component</div>);

jest.mock('../data/FOMOTaxiMap', () => ({
  features: [
    { name: 'Zone 1' },
    { name: 'Zone 2' }
  ]
}));


  test('renders map and components', () => {
    render(<MapPage />);

    // Check if the map components are rendered
    expect(screen.getByText('UserMarker Component')).toBeInTheDocument();
    expect(screen.getByText('TaxiZoneGeoJSON Component')).toBeInTheDocument();
    expect(screen.getByText('LegendControl Component')).toBeInTheDocument();

    // Check if the features are rendered
    expect(screen.getByText('Zone 1')).toBeInTheDocument();
    expect(screen.getByText('Zone 2')).toBeInTheDocument();

    // Check if the hover info box is rendered with default text
    expect(screen.getByText('No Hover Info')).toBeInTheDocument();
  });
