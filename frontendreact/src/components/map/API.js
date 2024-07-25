export const fetchBusyness = async () => {

  try {
    const response = await fetch('/api/location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const text = await response.text(); // Read the response as text
    console.log('Response text:', text);

    const data = JSON.parse(text); // Parse the text to JSON
    console.log('Parsed response data:', data);

    return data;
  } catch (error) {
    console.error('Failed to fetch busyness data:', error);
    return null;
  }
};
