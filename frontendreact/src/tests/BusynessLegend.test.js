// src/tests/LegendControl.test.js
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import LegendControl from '../components/map/BusynessLegend';
import { getHeatmapColor, getBusynessDescription } from '../components/map/heatmap';

// Mock react-leaflet's useMap hook
jest.mock('react-leaflet', () => ({
  ...jest.requireActual('react-leaflet'),
  useMap: jest.fn(),
}));

// Mock heatmap functions
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
        bottomright: document.createElement('div'),
      },
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

    expect(mockMap._controlCorners.bottomright.innerHTML).toContain('Busyness Scale');
    expect(mockMap._controlCorners.bottomright.innerHTML).toContain('color0.8');
    expect(mockMap._controlCorners.bottomright.innerHTML).toContain('description0.8');
  });

  test('removes legend from map on unmount', () => {
    const { unmount } = render(<LegendControl />);

    unmount();

    expect(mockMap.removeControl).toHaveBeenCalled();
  });
});


