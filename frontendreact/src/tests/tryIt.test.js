import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import TryIt from '../components/landing/tryIt'; 


jest.mock('../assets/Map.png', () => 'mapImg.jpg');

describe('TryIt Component', () => {
  test('renders the TryIt component', () => {
    render(<TryIt />);
    expect(screen.getByTestId('about-us')).toBeInTheDocument();
  });

  test('displays the title and description correctly', () => {
    render(<TryIt />);
    expect(screen.getByText('Try Our Map')).toBeInTheDocument();
    expect(screen.getByText('Party People Only: 6pm to 6am')).toBeInTheDocument();
  });

  test('displays the image with correct src attribute', () => {
    render(<TryIt />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'mapImg.jpg'); // Adjust according to your mock setup
  });

  test('image link has correct href attribute', () => {
    render(<TryIt />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/map');
  });
});
