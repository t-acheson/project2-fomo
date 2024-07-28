// Features.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Features from '../components/landing/features'; 

describe('Features Component', () => {
    test('renders the Features component', () => {
      render(<Features />);
      // Check if the section with id "features" is present in the document
      expect(screen.getByTestId('features-section')).toBeInTheDocument();
    });
});
  
    test('displays the correct header texts', () => {
      render(<Features />);
      // Check if the main headers are present
      expect(screen.getByText('Say Goodbye to FOMO!')).toBeInTheDocument();
      expect(screen.getByText('with our app:')).toBeInTheDocument();
    });
  
    test('contains feature descriptions', () => {
      render(<Features />);
      // Check if specific feature descriptions are present
      expect(screen.getByText('Find THE hottest place to be within the next hour, just check out our map!')).toBeInTheDocument();
      expect(screen.getByText('See what socialites near you have to say! They\'re only 2km or a comment away!')).toBeInTheDocument();
      expect(screen.getByText('Looking for great buzz or chill vibes? Find a colour-coded location to match your mood.')).toBeInTheDocument();
      expect(screen.getByText('Discover trending comments with a single *click* of our map. Top comments on Tap!')).toBeInTheDocument();
      expect(screen.getByText('Looking for something specific? Sort comments by hot topics using our tag feature!')).toBeInTheDocument();
    });
  
    test('renders the feature image', () => {
      render(<Features />);
      // Check if the image is in the document
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'discoBall.gif'); // Adjust the path if necessary
    });