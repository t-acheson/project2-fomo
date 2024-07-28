// src/tests/CommentDisplay.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import CommentDisplay from '../components/messageBoard/commentDisplay'; 
import Comment from '../components/messageBoard/comment'; 
import { nestComments } from '../components/messageBoard/nestedComments'; 

// Mocking Comment and nestComments
jest.mock('../components/messageBoard/comment', () => () => <div>Comment</div>);
jest.mock('../components/messageBoard/nestedComments', () => ({
  nestComments: jest.fn(),
}));

describe('CommentDisplay Component', () => {
  test('renders a "No Comments Available" message when no comments are provided', () => {
    // Mock the nestComments function to return an empty array
    nestComments.mockReturnValue([]);

    render(<CommentDisplay comments={[]} />);

    // Check if the "No Comments Available" message is displayed
    expect(screen.getByText('No Comments Available')).toBeInTheDocument();
  });

  test('renders a list of comments when comments are provided', () => {
    // Mock the nestComments function to return a list of comments
    const mockComments = [
      { id: '1', text: 'Comment 1', replies: [] },
      { id: '2', text: 'Comment 2', replies: [] },
    ];
    nestComments.mockReturnValue(mockComments);

    render(<CommentDisplay comments={mockComments} />);

    // Check if the comments are rendered
    expect(screen.getAllByText('Comment')).toHaveLength(mockComments.length);
  });
});
