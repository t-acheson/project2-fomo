import { fetchBusyness } from "./API";

//Function to map busyness to color
export const getHeatmapColor = (busyness) => {
  if (busyness >= 0.8) return '#ee4d5a';       // Highest busyness
  if (busyness >= 0.6) return '#f66356';     // High busyness
  if (busyness >= 0.4) return '#f97b57';     // Medium busyness
  if (busyness >= 0.2) return '#f7945d';     // Low busyness
  if (busyness >= 0.0) return '#f3ad6a';     // Very low busyness
  return '#ffea00';  
  };
  
  export const getBusynessDescription = (busyness) => {
    if (busyness >= 0.8) return 'Extremely Busy';      
    if (busyness >= 0.6) return 'Very Busy';     
    if (busyness >= 0.4) return 'A little Busy';     
    if (busyness >= 0.2) return 'Not Busy';     
    if (busyness >= 0.0) return 'Quiet';                             
  };
  
  const prepareHeatmapData = async (features) => {
    const busynessData = await fetchBusyness();
    console.log('111111111111111111',busynessData);
    if (!busynessData) return features; // Return original features if fetching fails
    
    // Create a map of busyness data for easy lookup by location_id
    const busynessMap = busynessData;

  // Update each feature with its corresponding busyness and fillColor
  return features.map((feature) => {
    const busyness = busynessMap[feature.properties.location_id] || 0;
    return {
      ...feature,
      properties: {
        ...feature.properties,
        busyness: getBusynessDescription(busyness),
        fillColor: getHeatmapColor(busyness),
      },
    };
  });
};
  export { prepareHeatmapData };