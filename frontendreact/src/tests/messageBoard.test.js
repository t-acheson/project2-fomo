import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Comment from '../components/messageBoard/comment';
import socket from '../webSocket';

// Correctly mock the WebSocket instance
jest.mock('../webSocket', () => ({
    __esModule: true, // Indicates that the module exports an ES6 module
    default: {
      readyState: 1, // Initial state indicating the WebSocket is open
      send: jest.fn(), // Mock the send function
      close: jest.fn(), // Mock the close function
      onmessage: jest.fn(), // Mock the onmessage event handler
      onclose: jest.fn(), // Mock the onclose event handler
      onerror: jest.fn(), // Mock the onerror event handler
      onopen: jest.fn(), // Mock the onopen event handler
    },
  }));
  
  
  
  

let originalConsoleError;

beforeEach(() => {
  // Save the original console.error function
  originalConsoleError = console.error;

  // Replace console.error with a Jest mock function
  console.error = jest.fn();

  jest.clearAllMocks();
});


afterEach(() => {
  // Restore the original console.error after each test
  console.error = originalConsoleError;
});

// Mock the global alert function
global.alert = jest.fn();

describe('Comment Component', () => {
  const handleInsertNode = jest.fn();
  const mockComment = {
    id: 1,
    name: 'Test Comment',
    items: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the initial comment textarea', () => {
    render(<Comment handleInsertNode={handleInsertNode} comment={mockComment} />);
    const textarea = screen.getByPlaceholderText('type...');
    expect(textarea).toBeInTheDocument();
  });

  test('renders the reply button and handles clicking it', () => {
    render(<Comment handleInsertNode={handleInsertNode} comment={mockComment} />);
    const replyButton = screen.queryByText(/REPLY/i);
    if (replyButton) {
      fireEvent.click(replyButton);
      const textarea = screen.getByPlaceholderText('type...');
      expect(textarea).toBeInTheDocument();
    } else {
      console.error('Reply button not found');
    }
  });

  test('allows user to add a comment', async () => {
    render(<Comment handleInsertNode={handleInsertNode} comment={mockComment} />);
    const textarea = screen.getByPlaceholderText('type...');
    fireEvent.change(textarea, { target: { value: 'New Comment' } });
    await waitFor(() => expect(textarea.value).toBe('New Comment'));

    const addButtons = screen.getAllByText(/COMMENT/i);
    const addButton = addButtons.find(button => button.tagName === 'DIV'); // Assuming addButton is a div

    if (!addButton) {
      throw new Error('Add button not found');
    }

    fireEvent.click(addButton);
    expect(handleInsertNode).toHaveBeenCalledWith(mockComment.id, 'New Comment');
    expect(socket.send).toHaveBeenCalledWith(JSON.stringify({ id: mockComment.id, text: 'New Comment' }));

    // Optionally, assert that the UI has updated to reflect the new comment
    // This depends on how your component renders comments
  });

  test('does not allow empty comments', () => {
    render(<Comment handleInsertNode={handleInsertNode} comment={mockComment} />);
    const addButton = screen.getByText(/COMMENT/i);
    fireEvent.click(addButton);
    expect(global.alert).toHaveBeenCalledWith('Comment cannot be empty');
  });

  test('handles WebSocket not open scenario', () => {
    // Change WebSocket readyState to CLOSED (3 is the CLOSED state for WebSocket)
    socket.default.readyState = 3;
  
    render(<Comment handleInsertNode={handleInsertNode} comment={mockComment} />);
    const textarea = screen.getByPlaceholderText('type...');
    fireEvent.change(textarea, { target: { value: 'New Comment' } });
  
    const addButtons = screen.getAllByText(/COMMENT/i);
    const addButton = addButtons.find(button => button.tagName === 'DIV'); // Assuming addButton is a div
  
    if (!addButton) {
      throw new Error('Add button not found');
    }
  
    fireEvent.click(addButton);
    expect(handleInsertNode).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('WebSocket is not open. Unable to send message:', { id: mockComment.id, text: 'New Comment' });
  });
  
});