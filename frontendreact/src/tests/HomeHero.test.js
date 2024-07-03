import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // This should cover extend-expect

import HomeHero from '../components/homeHero'; // Adjust the import path

// Define heroData within the test file or import it if it's in a separate file
const heroData = [
  {
    id: 1,
    image: require('../assets/testHeroImage.png'),
    title: 'The perfect Location for your pop-up',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab suscipit dicta nulla. Consequuntur obcaecati officiis, labore doloribus non tempore impedit consequatur ab dolor. Explicabo quam repellendus vero omnis, nisi odio!',
  },
  {
    id: 2,
    image: require('../assets/testHeroImage.png'),
    title: 'Start Comparing locations',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab suscipit dicta nulla. Consequuntur obcaecati officiis, labore doloribus non tempore impedit consequatur ab dolor. Explicabo quam repellendus vero omnis, nisi odio!',
  },
  {
    id: 3,
    image: require('../assets/testHeroImage.png'),
    title: 'Enjoy the Difference',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab suscipit dicta nulla. Consequuntur obcaecati officiis, labore doloribus non tempore impedit consequatur ab dolor. Explicabo quam repellendus vero omnis, nisi odio!',
  }
];

describe('HomeHero Component', () => {
  beforeEach(() => {
    render(<HomeHero />);
  });

  test('renders without crashing', () => {
    const heroSection = screen.getByTestId('home-hero'); // Use data-testid
    expect(heroSection).toBeInTheDocument();
  });

  test('renders correct number of slides', () => {
    const slides = screen.getAllByRole('img');
    expect(slides).toHaveLength(3);
  });

  test('renders slide titles and descriptions', () => {
    heroData.forEach((hero) => {
      const title = screen.getByText(hero.title);
      const descriptions = screen.getAllByText(hero.description);

      expect(title).toBeInTheDocument();
      expect(descriptions).toHaveLength(1); // Ensure only one matching description per slide
    });
  });

  test('renders button with correct link', () => {
    const buttons = screen.getAllByRole('link', { name: /get started/i });
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('href', '/map');
    });
  });

  test('images have correct alt text', () => {
    heroData.forEach((hero) => {
      const img = screen.getByAltText(`Slide${hero.id}`);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', hero.image.default); // Adjusting the src attribute
    });
  });
});
