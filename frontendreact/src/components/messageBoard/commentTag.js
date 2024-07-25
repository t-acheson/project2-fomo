// TagFilter.js
import React from 'react';
import Select from 'react-select';
import { customTagStyles } from './customTagStyle';
import '../cssFiles/commentDisplay.css';

const TagFilter = ({ className, setSelectedTags }) => {
  const tags = [
    { value: 'Non-alcoholic', label: 'Non-alcoholic' },
    { value: 'FoodieFind', label: 'FoodieFind' },
    { value: 'HiddenGem', label: 'HiddenGem' },
    { value: 'Outdoor', label: 'Outdoor' },
    { value: 'ChillVibes', label: 'ChillVibes' },
    { value: 'BarHopping', label: 'BarHopping' },
    { value: 'GameNight', label: 'GameNight' },
    { value: 'Festival', label: 'Festival' },
    { value: 'CommunityEvent', label: 'CommunityEvent' },
    { value: 'Exhibit', label: 'Exhibit' },
    { value: 'Theater', label: 'Theater' },
    { value: 'Concert', label: 'Concert' },
    { value: 'Crowded', label: 'Crowded' },
    { value: 'LiveMusic', label: 'LiveMusic' },
    { value: 'DateSpot', label: 'DateSpot' },
    { value: 'OpenMic', label: 'OpenMic' }
  ];

  const handleTagChange = (selectedOptions) => {
    setSelectedTags(selectedOptions.map(tag => tag.value));
  };

  return (
    <Select
      isMulti
      options={tags}
      onChange={handleTagChange}
      placeholder="Filter by tags"
      className={`tag-select ${className}`} // Apply the custom className here
      styles={customTagStyles} // Add this line to apply the CSS styles
    />
  );
};

export default TagFilter;

