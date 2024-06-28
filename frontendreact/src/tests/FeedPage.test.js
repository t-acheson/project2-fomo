
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import FeedPage from '../pages/FeedPage';

/**
 * Test suite for the FeedPage component.
 * Basic unit test, no integration done 
 */
describe('FeedPage', () => {
    
    //  Test case to check if the FeedPage component renders correctly.

    test('renders FeedPage component correctly', () => {
        render(<FeedPage />);
        
        // Assert that the heading with text "Feed Page" is present in the document.
        expect(screen.getByRole('heading', { name: /Feed Page/i })).toBeInTheDocument();
        
        // Assert that the text "This is the feed page" is present in the document.
        expect(screen.getByText(/This is the feed page/i)).toBeInTheDocument();
    });
});
