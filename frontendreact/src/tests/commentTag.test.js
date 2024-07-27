// TagFilter.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Select from 'react-select';
import TagFilter from '../components/messageBoard/commentTag';

// Mock the customTagStyles
jest.mock('../components/messageBoard/customTagStyle', () => ({
  customTagStyles: {}
}));

// Mock the react-select component
jest.mock('react-select', () => ({
  __esModule: true,
  default: ({ onChange, options, ...props }) => (
    <select
      {...props}
      onChange={e => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => ({
          value: option.value,
          label: option.label
        }));
        onChange(selectedOptions);
      }}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}));

describe('TagFilter Component', () => {
  test('renders with correct options', () => {
    render(<TagFilter setSelectedTags={() => {}} />);
    
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    // Check if options are rendered correctly
    const options = [
      'Non-alcoholic', 'FoodieFind', 'HiddenGem', 'Outdoor', 'ChillVibes',
      'BarHopping', 'GameNight', 'Festival', 'CommunityEvent', 'Exhibit',
      'Theater', 'Concert', 'Crowded', 'LiveMusic', 'DateSpot', 'OpenMic'
    ];

    options.forEach(option => {
      expect(screen.getByRole('option', { name: option })).toBeInTheDocument();
    });
  });

  test('calls setSelectedTags with selected values', () => {
    const setSelectedTags = jest.fn();
    render(<TagFilter setSelectedTags={setSelectedTags} />);
    
    // Simulate user selecting options
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'FoodieFind' }
    });
    
    // Ensure the function is called with the correct arguments
    expect(setSelectedTags).toHaveBeenCalledWith(['FoodieFind']);
  });
});
