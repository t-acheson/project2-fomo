import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LikeButton from '../components/messageBoard/likeButton'; 

test('renders initially with zero likes and correct heart icon class', () => {
    render(<LikeButton />);
    
    // Use getByTestId or another query method that doesn't rely on role
    const heartIcon = screen.getByText(/0/i).previousElementSibling.querySelector('.heartIcon');
    expect(heartIcon).not.toHaveClass('liked'); // Initially, the heart icon should not have the 'liked' class
    
    const likesStatus = screen.getByText(/0/i);
    expect(likesStatus).toBeInTheDocument(); // Check that the likes count is displayed as 0
  });

  test('toggles liked state and updates likes count on click', () => {
    render(<LikeButton />);
    
    // Simulate clicking the like button by targeting the parent div of the heart icon
    fireEvent.click(screen.getByText(/0/i).parentElement);
    
    // After clicking, check the updated state
    const likesStatusAfterClick = screen.getByText(/1/i);
    expect(likesStatusAfterClick).toBeInTheDocument(); // Likes count should update to 1
    
    // Simulate another click to unlike
    fireEvent.click(screen.getByText(/1/i).parentElement);
    const likesStatusAfterSecondClick = screen.getByText(/0/i);
    expect(likesStatusAfterSecondClick).toBeInTheDocument(); // Likes count should revert to 0
  });

  test('provides visual feedback based on liked state', () => {
    render(<LikeButton />);
    
    // Simulate clicking the like button
    fireEvent.click(screen.getByText(/0/i).parentElement); // Like the post
    
    // After liking, check the heart icon class
    const heartIconLiked = screen.getByText(/1/i).previousElementSibling.querySelector('.heartIcon');
    expect(heartIconLiked).toHaveClass('liked'); // Heart icon should reflect the 'liked' state visually
    
    // Simulate unliking the post
    fireEvent.click(screen.getByText(/1/i).parentElement); // Unlike the post
    const heartIconUnliked = screen.getByText(/0/i).previousElementSibling.querySelector('.heartIcon');
    expect(heartIconUnliked).not.toHaveClass('liked'); // Heart icon should no longer have the 'liked' class
  });
  