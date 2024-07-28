import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReplyInput from '../components/messageBoard/replyInput';
import { sendMessage } from '../hooks/webSocket';

// Mock the sendMessage function
jest.mock('../hooks/webSocket', () => ({
  sendMessage: jest.fn()
}));

describe('ReplyInput Component', () => {
  const mockParentId = '123';
  const mockOnSubmitReply = jest.fn();
  const mockOnCancelReply = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  test('renders ReplyInput with initial state', () => {
    render(
      <ReplyInput 
        parentId={mockParentId} 
        onSubmitReply={mockOnSubmitReply} 
        onCancelReply={mockOnCancelReply} 
      />
    );

    expect(screen.getByPlaceholderText('Enter your reply')).toBeInTheDocument();
    expect(screen.getByText('Submit Reply')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('updates input value on change', () => {
    render(
      <ReplyInput 
        parentId={mockParentId} 
        onSubmitReply={mockOnSubmitReply} 
        onCancelReply={mockOnCancelReply} 
      />
    );

    const input = screen.getByPlaceholderText('Enter your reply');
    fireEvent.change(input, { target: { value: 'Test reply' } });

    expect(input.value).toBe('Test reply');
  });

  test('submits reply and calls sendMessage', () => {
    render(
      <ReplyInput 
        parentId={mockParentId} 
        onSubmitReply={mockOnSubmitReply} 
        onCancelReply={mockOnCancelReply} 
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your reply'), { target: { value: 'Test reply' } });
    fireEvent.click(screen.getByText('Submit Reply'));

    expect(sendMessage).toHaveBeenCalledWith({
      type: 'reply_update',
      parentid: mockParentId,
      text: 'Test reply'
    });

    expect(mockOnSubmitReply).toHaveBeenCalledWith({
      parentid: mockParentId,
      text: 'Test reply',
      timestamp: expect.any(String) // Expecting a timestamp
    });
    
    expect(screen.getByPlaceholderText('Enter your reply').value).toBe('');
  });

  test('shows alert and does not submit when reply is empty', () => {
    // Mock window.alert
    window.alert = jest.fn();

    render(
      <ReplyInput 
        parentId={mockParentId} 
        onSubmitReply={mockOnSubmitReply} 
        onCancelReply={mockOnCancelReply} 
      />
    );

    fireEvent.click(screen.getByText('Submit Reply'));

    expect(window.alert).toHaveBeenCalledWith('Reply cannot be empty');
    expect(sendMessage).not.toHaveBeenCalled();
    expect(mockOnSubmitReply).not.toHaveBeenCalled();
  });

  test('clears input and calls onCancelReply when cancel button is clicked', () => {
    render(
      <ReplyInput 
        parentId={mockParentId} 
        onSubmitReply={mockOnSubmitReply} 
        onCancelReply={mockOnCancelReply} 
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your reply'), { target: { value: 'Test reply' } });
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.getByPlaceholderText('Enter your reply').value).toBe('');
    expect(mockOnCancelReply).toHaveBeenCalled();
  });
});
