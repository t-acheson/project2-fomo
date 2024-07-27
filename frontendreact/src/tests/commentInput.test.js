import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // for additional matchers
import CommentInput from '../components/messageBoard/commentInput'; 
import { LocationContext } from '../App'; 
import { sendMessage } from '../hooks/webSocket';

// Mock the sendMessage function
jest.mock('../hooks/webSocket', () => ({
  sendMessage: jest.fn()
}));

// Mock react-select component
jest.mock('react-select', () => ({
  __esModule: true,
  default: ({ onChange, options, value, ...props }) => (
    <div>
      <div role="combobox" aria-label={props.placeholder} onClick={() => onChange(options)}>
        {props.placeholder}
      </div>
      {options.map(option => (
        <div
          key={option.value}
          onClick={() => onChange([option])}
        >
          {option.label}
        </div>
      ))}
      {/* Simulate display of selected tags */}
      {value && value.length > 0 && (
        <div>
          {value.map(v => (
            <div key={v.value}>{v.label}</div>
          ))}
        </div>
      )}
    </div>
  )
}));

describe('CommentInput Component', () => {
  const mockLocation = { lat: 40.7128, lng: -74.0060 };
  
  test('renders CommentInput component with initial state', () => {
    render(
      <LocationContext.Provider value={mockLocation}>
        <CommentInput />
      </LocationContext.Provider>
    );

    // Check if the input box is rendered
    expect(screen.getByPlaceholderText('Enter your message (280 characters max)')).toBeInTheDocument();
    
    // Check if the select component is rendered
    expect(screen.getByText('Must select tags (max 3)')).toBeInTheDocument();
    
    // Check if the submit button is rendered
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('displays alert message when comment is empty and submit is clicked', async () => {
    render(
      <LocationContext.Provider value={mockLocation}>
        <CommentInput />
      </LocationContext.Provider>
    );

    // Click the submit button
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check if alert message for empty comment is displayed
    expect(await screen.findByText('Comment cannot be empty')).toBeInTheDocument();
  });

  test('displays alert message when no tags are selected and submit is clicked', async () => {
    render(
      <LocationContext.Provider value={mockLocation}>
        <CommentInput />
      </LocationContext.Provider>
    );

    // Enter text into the input field
    fireEvent.change(screen.getByPlaceholderText('Enter your message (280 characters max)'), {
      target: { value: 'Test comment' }
    });

    // Click the submit button
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check if alert message for no tags is displayed
    expect(await screen.findByText('Please select at least one tag')).toBeInTheDocument();
  });

  // test('submits the comment and displays success message when valid input is provided', async () => {
  //   render(
  //     <LocationContext.Provider value={mockLocation}>
  //       <CommentInput />
  //     </LocationContext.Provider>
  //   );
  
  //   // Enter text into the input field
  //   fireEvent.change(screen.getByPlaceholderText('Enter your message (280 characters max)'), {
  //     target: { value: 'Test comment' }
  //   });
  
  //   // Open the react-select dropdown and select a tag
  //   const selectInput = screen.getByText('Must select tags (max 3)');
  //   fireEvent.click(selectInput); // Open the select dropdown
  
  //   // Wait for the options to be rendered and select a tag
  //   await waitFor(() => {
  //     fireEvent.click(screen.getByText('FoodieFind'));
  //   });
  
  //   // Click the submit button
  //   fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  //   // Wait for the success alert message
  //   expect(await screen.findByText('Comment added successfully!')).toBeInTheDocument();
  
  //   // Check if sendMessage was called with correct arguments
  //   expect(sendMessage).toHaveBeenCalledWith({
  //     type: 'new_comment',
  //     text: 'Test comment',
  //     lat: mockLocation.lat,
  //     lng: mockLocation.lng,
  //     tags: { tag1: 'FoodieFind' }
  //   });
  
  //   // Check if the input is cleared after submission
  //   expect(screen.getByPlaceholderText('Enter your message (280 characters max)')).toHaveValue('');
  
  //   // Check if react-select's selected options are cleared
  //   // Ensure the tag 'FoodieFind' is not present
  //   const selectContainer = screen.queryByText('FoodieFind');
  //   expect(selectContainer).toBeNull(); // Check that the tag is not present
  // });   
});  