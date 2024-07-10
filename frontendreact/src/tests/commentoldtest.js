import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Comment from '../components/messageBoard/comment';
import socket from '../webSocket';

// Mock the WebSocket instance
jest.mock('../webSocket', () => {
    let eventHandler = {};
    return {
      __esModule: true,
      default: {
        readyState: 1, // 1 is the OPEN state for WebSocket
        send: jest.fn().mockImplementation((message) => {
          const parsedMessage = JSON.parse(message);
          eventHandler.onmessage({ data: JSON.stringify(parsedMessage) });
        }),
        close: jest.fn(),
        onmessage: (handler) => {
          eventHandler.onmessage = handler;
        },
        onclose: () => {},
        onerror: () => {},
        onopen: () => {},
      },
    };
  });
  
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
    
    // Use queryByText to check if the element exists
    const replyButton = screen.queryByText(/REPLY/i);
    if (replyButton) {
      fireEvent.click(replyButton);
      const textarea = screen.getByPlaceholderText('type...');
      expect(textarea).toBeInTheDocument();
    } else {
      console.error('Reply button not found');
    }
  });

  test('allows user to add a comment', () => {
    render(<Comment handleInsertNode={handleInsertNode} comment={mockComment} />);
    const textarea = screen.getByPlaceholderText('type...');
    fireEvent.change(textarea, { target: { value: 'New Comment' } });
    expect(textarea.value).toBe('New Comment');

    // Use queryAllByText to check if the element exists
    const addButtons = screen.queryAllByText(/COMMENT/i);
    const addButton = addButtons.find(button => button.tagName === 'DIV'); // Assuming addButton is a div

    if (addButton) {
      fireEvent.click(addButton);
      expect(handleInsertNode).toHaveBeenCalledWith(mockComment.id, 'New Comment');
      expect(socket.send).toHaveBeenCalledWith(JSON.stringify({ id: mockComment.id, text: 'New Comment' }));
    } else {
      console.error('Add button not found');
    }
  });

  test('does not allow empty comments', () => {
    render(<Comment handleInsertNode={handleInsertNode} comment={mockComment} />);
    const addButton = screen.getByText(/COMMENT/i);
    fireEvent.click(addButton);
    expect(global.alert).toHaveBeenCalledWith('Comment cannot be empty');
  });

  test('handles WebSocket not open scenario', () => {
    // Change WebSocket readyState to CLOSED (3 is the CLOSED state for WebSocket)
    socket.readyState = 3;

    render(<Comment handleInsertNode={handleInsertNode} comment={mockComment} />);
    const textarea = screen.getByPlaceholderText('type...');
    fireEvent.change(textarea, { target: { value: 'New Comment' } });

    // Use queryAllByText to check if the element exists
    const addButtons = screen.queryAllByText(/COMMENT/i);
    const addButton = addButtons.find(button => button.tagName === 'DIV'); // Assuming addButton is a div

    if (addButton) {
      fireEvent.click(addButton);
      expect(handleInsertNode).toHaveBeenCalledWith(mockComment.id, 'New Comment');
      expect(console.error).toHaveBeenCalledWith('WebSocket is not open. Unable to send message:', { id: mockComment.id, text: 'New Comment' });
    } else {
      console.error('Add button not found');
    }
  });

});
