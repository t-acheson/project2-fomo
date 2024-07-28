import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import LegendControl from '../components/map/BusynessLegend';
import { getHeatmapColor, getBusynessDescription } from '../components/map/heatmap';

jest.mock('react-leaflet', () => ({
  ...jest.requireActual('react-leaflet'),
  useMap: jest.fn(),
}));

jest.mock('../components/map/heatmap', () => ({
  getHeatmapColor: jest.fn(),
  getBusynessDescription: jest.fn(),
}));

describe('LegendControl Component', () => {
  let mockMap;

  beforeEach(() => {
    mockMap = {
      removeControl: jest.fn(),
      _controlCorners: {
        bottomleft: document.createElement('div'),
      },
      addControl: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    };

    useMap.mockReturnValue(mockMap);
    getHeatmapColor.mockImplementation((grade) => `color${grade}`);
    getBusynessDescription.mockImplementation((grade) => `description${grade}`);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders LegendControl component and adds legend to map', () => {
    render(<LegendControl />);

    expect(mockMap._controlCorners.bottomleft.innerHTML).toContain('Busyness Scale');
    expect(mockMap._controlCorners.bottomleft.innerHTML).toContain('color0.8');
    expect(mockMap._controlCorners.bottomleft.innerHTML).toContain('description0.8');
  });

  test('removes legend from map on unmount', () => {
    const { unmount } = render(<LegendControl />);

    unmount();

    expect(mockMap.removeControl).toHaveBeenCalled();
  });
});
