// src/tests/Comment.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import Comment from '../components/messageBoard/comment'; 

// Mocking child components
jest.mock('../components/messageBoard/likeAndDislikeButton', () => () => <div>LikeDislikeButton</div>);
jest.mock('../components/messageBoard/replyInput', () => ({ onSubmitReply }) => (
  <button onClick={() => onSubmitReply({ id: 'reply1', text: 'Reply' })}>Submit Reply</button>
));
jest.mock('../components/messageBoard/commentTime', () => () => <div>CommentTime</div>);
jest.mock('../components/messageBoard/commentTagDisplay', () => () => <div>CommentTags</div>);

describe('Comment Component', () => {
  const mockComment = {
    id: 'comment1',
    text: 'This is a comment',
    replies: [],
    likes: 0,
    dislikes: 0,
    tags: [],
    parentid: null,
  };

  test('renders comment text', () => {
    render(<Comment comment={mockComment} />);

    expect(screen.getByText('This is a comment')).toBeInTheDocument();
  });

  test('shows ReplyInput when Reply button is clicked', () => {
    render(<Comment comment={mockComment} />);

    // Check that ReplyInput is not present initially
    expect(screen.queryByText('Submit Reply')).toBeNull();

    // Click the Reply button
    fireEvent.click(screen.getByText('Reply'));

    // Check that ReplyInput is now present
    expect(screen.getByText('Submit Reply')).toBeInTheDocument();
  });

  test('shows and hides replies when toggle button is clicked', () => {
    // Mock comment with replies
    const commentWithReplies = {
      ...mockComment,
      replies: [
        {
          id: 'reply1',
          text: 'This is a reply',
          replies: [],
          likes: 0,
          dislikes: 0,
          tags: [],
          parentid: 'comment1',
        },
      ],
    };

    render(<Comment comment={commentWithReplies} />);

    // Initially, replies should not be visible
    expect(screen.queryByText('This is a reply')).toBeNull();

    // Click the toggle button to show replies
    fireEvent.click(screen.getByRole('button', { name: /Expand/i }));

    // Replies should be visible now
    expect(screen.getByText('This is a reply')).toBeInTheDocument();

    // Click the toggle button again to hide replies
    fireEvent.click(screen.getByRole('button', { name: /Collapse/i }));

    // Replies should not be visible
    expect(screen.queryByText('This is a reply')).toBeNull();
  });
});
