import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LikeDislikeButton from '../components/messageBoard/likeAndDislikeButton';
import { sendMessage } from '../hooks/webSocket';

// Mock the sendMessage function
jest.mock('../hooks/webSocket', () => ({
  sendMessage: jest.fn()
}));

describe('LikeDislikeButton Component', () => {
  const mockCommentId = '123';
  const mockLikesCount = 5;
  const mockDislikesCount = 2;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  test('renders LikeDislikeButton with initial state', () => {
    render(
      <LikeDislikeButton 
        commentId={mockCommentId} 
        likesCounts={mockLikesCount} 
        dislikesCounts={mockDislikesCount} 
      />
    );

    expect(screen.getByText(mockLikesCount)).toBeInTheDocument();
    expect(screen.getByText(mockDislikesCount)).toBeInTheDocument();
  });

  // test('handles like button click', async () => {
  //   render(
  //     <LikeDislikeButton 
  //       commentId={mockCommentId} 
  //       likesCounts={mockLikesCount} 
  //       dislikesCounts={mockDislikesCount} 
  //     />
  //   );

  //   const likeButton = screen.getByRole('button', { name: /heart/i });

  //   // Click the like button
  //   fireEvent.click(likeButton);

  //   // Wait for the UI to update and check the updated like count
  //   await waitFor(() => {
  //     expect(screen.getByText((mockLikesCount + 1).toString())).toBeInTheDocument();
  //   });

  //   // Verify sendMessage was called with correct parameters
  //   expect(sendMessage).toHaveBeenCalledWith({
  //     type: 'like_update',
  //     commentid: mockCommentId,
  //     like: true
  //   });

  //   // Click the like button again to remove the like
  //   fireEvent.click(likeButton);

  //   // Wait for the UI to update and check the like count reverted
  //   await waitFor(() => {
  //     expect(screen.getByText(mockLikesCount.toString())).toBeInTheDocument();
  //   });

  //   // Verify sendMessage was called to remove the like
  //   expect(sendMessage).toHaveBeenCalledWith({
  //     type: 'like_update',
  //     commentid: mockCommentId,
  //     like: false
  //   });
  // });

  test('handles dislike button click', async () => {
    render(
      <LikeDislikeButton 
        commentId={mockCommentId} 
        likesCounts={mockLikesCount} 
        dislikesCounts={mockDislikesCount} 
      />
    );

    const dislikeButton = screen.getByRole('button', { name: /heart_broken/i });

    // Click the dislike button
    fireEvent.click(dislikeButton);

    // Wait for the UI to update and check the updated dislike count
    await waitFor(() => {
      expect(screen.getByText((mockDislikesCount + 1).toString())).toBeInTheDocument();
    });

    // Verify sendMessage was called with correct parameters
    expect(sendMessage).toHaveBeenCalledWith({
      type: 'dislike_update',
      commentid: mockCommentId,
      dislike: true
    });

    // Click the dislike button again to remove the dislike
    fireEvent.click(dislikeButton);

    // Wait for the UI to update and check the dislike count reverted
    await waitFor(() => {
      expect(screen.getByText(mockDislikesCount.toString())).toBeInTheDocument();
    });

    // Verify sendMessage was called to remove the dislike
    expect(sendMessage).toHaveBeenCalledWith({
      type: 'dislike_update',
      commentid: mockCommentId,
      dislike: false
    });
  });
});
