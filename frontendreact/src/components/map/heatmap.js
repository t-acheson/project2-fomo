import busynessData from '../../data/exampleBusynessData.json';

console.log(busynessData.locations); 

//Function to map busyness to color
export const getHeatmapColor = (busyness) => {
    if (busyness >= 0.75) return '#d7301f';  
    if (busyness >= 0.5) return '#fc8d59';  
    if (busyness >= 0.25) return '#fdcc8a';  
    return '#fef0d9';  
  };
  

  const prepareHeatmapData = (features) => {
    const busynessMap = busynessData.locations.reduce((map, item) => {
      map[item.location_id] = item.busyness;
      return map;
    }, {});
  
    return features.map((feature) => {
      const busyness = busynessMap[feature.properties.location_id] || 0;
      return {
        ...feature,
        properties: {
          ...feature.properties,
          busyness,
          fillColor: getHeatmapColor(busyness),
        },
      };
    });
  };
  
  export { prepareHeatmapData };