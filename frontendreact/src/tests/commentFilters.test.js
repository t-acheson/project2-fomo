// src/tests/CommentFilter.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // for additional matchers
import CommentFilter from '../components/messageBoard/commentFilters'; 

describe('CommentFilter Component', () => {
    // Mock the setSortCriteria function
    const setSortCriteria = jest.fn();
  
    beforeEach(() => {
      // Clear mock calls before each test
      setSortCriteria.mockClear();
    });
  
    test('renders DropdownButton with correct title and variant', () => {
      render(<CommentFilter setSortCriteria={setSortCriteria} />);
  
      // Check if the DropdownButton title is rendered
      expect(screen.getByText('Sort Comments')).toBeInTheDocument();
      
      // Check if the DropdownButton has the correct variant class
      const dropdownButton = screen.getByRole('button', { name: /sort comments/i });
      expect(dropdownButton).toHaveClass('btn-warning');
    });
  
    test('renders Dropdown.Items for sorting options', async () => {
      render(<CommentFilter setSortCriteria={setSortCriteria} />);
  
      // Click the DropdownButton to open the dropdown menu
      fireEvent.click(screen.getByRole('button', { name: /sort comments/i }));
  
      // Check if the sorting options are rendered
      expect(await screen.findByText('Most Recent')).toBeInTheDocument();
      expect(await screen.findByText('Most Likes')).toBeInTheDocument();
    });
  
    test('calls setSortCriteria with "most_recent" when "Most Recent" is clicked', async () => {
      render(<CommentFilter setSortCriteria={setSortCriteria} />);
  
      // Click the DropdownButton to open the dropdown menu
      fireEvent.click(screen.getByRole('button', { name: /sort comments/i }));
  
      // Click the "Most Recent" dropdown item
      fireEvent.click(await screen.findByText('Most Recent'));
  
      // Verify setSortCriteria was called with "most_recent"
      expect(setSortCriteria).toHaveBeenCalledWith('most_recent');
    });
  
    test('calls setSortCriteria with "most_likes" when "Most Likes" is clicked', async () => {
      render(<CommentFilter setSortCriteria={setSortCriteria} />);
  
      // Click the DropdownButton to open the dropdown menu
      fireEvent.click(screen.getByRole('button', { name: /sort comments/i }));
  
      // Click the "Most Likes" dropdown item
      fireEvent.click(await screen.findByText('Most Likes'));
  
      // Verify setSortCriteria was called with "most_likes"
      expect(setSortCriteria).toHaveBeenCalledWith('most_likes');
    });
  });