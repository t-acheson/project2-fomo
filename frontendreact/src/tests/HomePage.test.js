
import React from 'react'; 
import { render, screen } from '@testing-library/react'; 
import '@testing-library/jest-dom'; 
import HomePage from '../pages/HomePage'; 


describe('HomePage', () => {
    // beforeEach hook runs before each test in this suite, rendering the HomePage component
    beforeEach(() => {
        render(<HomePage />);
    });

    // Test case to verify that the HomePage component renders without crashing
    it('renders without crashing', () => {
        const mainElement = screen.getByRole('main'); // Queries for an element with the role 'main'
        expect(mainElement).toBeInTheDocument(); // Asserts that the queried element is present in the document
    });

    // Test case to check if the HomePage contains a specific welcome message
    it('contains welcome message', () => {
        const welcomeMessage = screen.getByText(/This is the home page/i); // Queries for text matching the regex pattern
        expect(welcomeMessage).toBeInTheDocument(); // Asserts that the welcome message is present in the document
    });
});