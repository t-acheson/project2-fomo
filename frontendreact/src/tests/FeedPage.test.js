import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import FeedPage from '../pages/FeedPage';

// Mock the CommentInput, CommentTag, and CommentDisplay components if necessary
jest.mock('../components/messageBoard/commentInput', () => () => (
  <div data-testid="comment-input">This is the comment input</div>
));
jest.mock('../components/messageBoard/commentTag', () => () => (
  <div data-testid="comment-tag">This is the comment tag</div>
));
jest.mock('../components/messageBoard/commentDisplay', () => ({ comments }) => (
  <div data-testid="comment-display">
    This is the comment display with {comments.length} comments
  </div>
));
jest.mock('../hooks/webSocket', () => ({
  listenForMessages: jest.fn()
}));

describe('FeedPage', () => {
  test('renders FeedPage component correctly', () => {
    render(<FeedPage />);

    // Assert that the CommentInput component is present in the document
    const commentInputElement = screen.getByTestId('comment-input');
    expect(commentInputElement).toBeInTheDocument();
    expect(commentInputElement).toHaveTextContent(/This is the comment input/i);

    // Assert that the CommentTag component is present in the document
    const commentTagElement = screen.getByTestId('comment-tag');
    expect(commentTagElement).toBeInTheDocument();
    expect(commentTagElement).toHaveTextContent(/This is the comment tag/i);

    // Assert that the CommentDisplay component is present in the document
    const commentDisplayElement = screen.getByTestId('comment-display');
    expect(commentDisplayElement).toBeInTheDocument();
    expect(commentDisplayElement).toHaveTextContent(/This is the comment display with 0 comments/i);
  });
});
