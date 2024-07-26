// fetchBusyness.test.js
import { fetchBusyness } from '../components/map/API';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

test('fetchBusyness should return data when fetch is successful', async () => {
  const mockData = { key: 'value' };

  fetchMock.mockResponseOnce(JSON.stringify(mockData)); // Mock fetch response

  const data = await fetchBusyness();

  expect(fetchMock).toHaveBeenCalledWith('location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  expect(data).toEqual(mockData);
});

test('fetchBusyness should handle non-200 status codes', async () => {
  fetchMock.mockResponseOnce('', { status: 500 }); // Mock fetch with error status

  const data = await fetchBusyness();

  expect(data).toBeNull(); // Expect null due to the error
});

test('fetchBusyness should handle JSON parsing errors', async () => {
  fetchMock.mockResponseOnce('not a json'); // Mock fetch with invalid JSON

  const data = await fetchBusyness();

  expect(data).toBeNull(); // Expect null due to JSON parsing error
});
