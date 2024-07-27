// src/tests/mapUtils.test.js
import { getHeatmapColor, getBusynessDescription, prepareHeatmapData } from '../components/map/heatmap';
import { fetchBusyness } from '../components/map/API';

// Mock fetchBusyness function
jest.mock('../components/map/API', () => ({
  fetchBusyness: jest.fn(),
}));

describe('Heatmap Utils', () => {
  describe('getHeatmapColor', () => {
    test.each([
      [0.9, '#FF4500'],
      [0.7, '#FFA500'],
      [0.5, '#FFFF00'],
      [0.3, '#ADD8E6'],
      [0.1, '#00BFFF'],
      [-0.1, '#ffea00']
    ])('returns correct color for busyness %f', (busyness, expectedColor) => {
      expect(getHeatmapColor(busyness)).toBe(expectedColor);
    });
  });

  describe('getBusynessDescription', () => {
    test.each([
      [0.9, 'Extremely Busy'],
      [0.7, 'Very Busy'],
      [0.5, 'A little Busy'],
      [0.3, 'Not Busy'],
      [0.1, 'Quiet']
    ])('returns correct description for busyness %f', (busyness, expectedDescription) => {
      expect(getBusynessDescription(busyness)).toBe(expectedDescription);
    });
  });

  describe('prepareHeatmapData', () => {
    const features = [
      { properties: { location_id: '1' } },
      { properties: { location_id: '2' } },
      { properties: { location_id: '3' } },
    ];

    const busynessData = {
      '1': 0.9,
      '2': 0.5,
      '3': 0.1,
    };

    beforeEach(() => {
      fetchBusyness.mockResolvedValue(busynessData);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('updates features with busyness and fillColor', async () => {
      const result = await prepareHeatmapData(features);

      expect(result).toEqual([
        {
          properties: {
            location_id: '1',
            busyness: 'Extremely Busy',
            fillColor: '#FF4500',
          },
        },
        {
          properties: {
            location_id: '2',
            busyness: 'A little Busy',
            fillColor: '#FFFF00',
          },
        },
        {
          properties: {
            location_id: '3',
            busyness: 'Quiet',
            fillColor: '#00BFFF',
          },
        },
      ]);
    });

    test('returns original features if fetching busyness data fails', async () => {
      fetchBusyness.mockResolvedValue(null);

      const result = await prepareHeatmapData(features);

      expect(result).toEqual(features);
    });
  });
});
