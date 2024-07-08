import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // This should cover extend-expect
import HomeHero from '../components/homeHero'; // Adjust the import path

const heroData = [
    {
      id: 1,
      image: 'testHeroImage.png',
      title: 'The perfect Location for your pop-up',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab suscipit dicta nulla. Consequuntur obcaecati officiis, labore doloribus non tempore impedit consequatur ab dolor. Explicabo quam repellendus vero omnis, nisi odio!',
    },
    {
      id: 2,
      image: 'testHeroImage.png',
      title: 'Start Comparing loctions',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab suscipit dicta nulla. Consequuntur obcaecati officiis, labore doloribus non tempore impedit consequatur ab dolor. Explicabo quam repellendus vero omnis, nisi odio!',
    },
    {
      id: 3,
      image: 'testHeroImage.png',
      title: 'Enjoy the Difference',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab suscipit dicta nulla. Consequuntur obcaecati officiis, labore doloribus non tempore impedit consequatur ab dolor. Explicabo quam repellendus vero omnis, nisi odio!',
    }
  ];
  
  describe('HomeHero Component', () => {
    beforeEach(() => {
      render(<HomeHero />);
    });
  
    test('renders without crashing', () => {
      const heroSection = screen.getByTestId('home-hero');
      expect(heroSection).toBeInTheDocument();
    });
  
    test('renders correct number of slides', () => {
      const slides = screen.getAllByRole('img');
      expect(slides).toHaveLength(heroData.length); // Adjust based on heroData length
    });
  
    test('renders slide titles and descriptions', () => {
        heroData.forEach((hero) => {
            const title = screen.getByText(hero.title);
            const descriptions = screen.getAllByText(hero.description); // Use getAllByText for descriptions

            expect(title).toBeInTheDocument();
            descriptions.forEach((description) => {
                expect(description).toBeInTheDocument();
            });
        });
    });
  
    test('renders button with correct link', () => {
      const buttons = screen.getAllByText(/get started/i);
      buttons.forEach((button) => {
        expect(button.closest('a')).toHaveAttribute('href', '/map');
      });
    });
  
    test('images have correct alt text', () => {
      heroData.forEach((hero) => {
        const img = screen.getByAltText(`Slide${hero.id}`);
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', hero.image); // Ensure the correct image source is set
      });
    });
  });