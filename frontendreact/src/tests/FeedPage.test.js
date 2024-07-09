import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import FeedPage from '../pages/FeedPage';
import MessageBoard from '../components/messageBoard/messageBoard';

// Mock the MessageBoard component if necessary
jest.mock('../components/messageBoard/messageBoard', () => () => (
  <div data-testid="message-board">This is the message board</div>
));

/**
 * Test suite for the FeedPage component.
 * Basic unit test, no integration done
 */
describe('FeedPage', () => {
  // Test case to check if the FeedPage component renders correctly.
  test('renders FeedPage component correctly', () => {
    render(<FeedPage />);

    // Assert that the MessageBoard component is present in the document.
    const messageBoardElement = screen.getByTestId('message-board');
    expect(messageBoardElement).toBeInTheDocument();
    expect(messageBoardElement).toHaveTextContent(/This is the message board/i);
  });
});
