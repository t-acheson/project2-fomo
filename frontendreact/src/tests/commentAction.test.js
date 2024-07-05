import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Action from '../components/messageBoard/commentAction';   


//Check if the Action component renders correctly with the given type and className
test('renders correctly with type and className', () => {
    // Create a mock function for the handleClick prop
    const handleClick = jest.fn();

    // Render the Action component with props
    render(<Action handleClick={handleClick} type="Test Type" className="test-class" />);
  
    // Find the rendered div element by its text content
    const actionDiv = screen.getByText('Test Type');

    // Assert that the found div has the expected className
    expect(actionDiv).toHaveClass('test-class');
});

//Verify that the Action component's onClick handler works as expected
test('calls handleClick when clicked', () => {
    // Create a mock function for the handleClick prop
    const handleClick = jest.fn();

    // Render the Action component with props
    render(<Action handleClick={handleClick} type="Test Type" className="test-class" />);
  
    // Find the rendered div element by its text content
    const actionDiv = screen.getByText('Test Type');

    // Simulate a click event on the div
    fireEvent.click(actionDiv);

    // Assert that the handleClick function was called once
    expect(handleClick).toHaveBeenCalledTimes(1);
});
