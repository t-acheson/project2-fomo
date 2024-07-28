import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import HomeHero from '../components/landing/homeHero'; 

const heroData = [
  {
    id: 1,
    image: require('../assets/road.jpg'),
    title: 'Find The Fun!',
    description: "Tap into NYC's social hotspots with our colour-coded map. Find locations predicted to be buzzing tonight so you can pick the perfect hangout spot to match your vibe!",
    link: '/map',
    buttonText: 'Map your Mood',
  },
  {
    id: 2,
    image: require('../assets/bridge.jpg'),
    title: 'The Buzz About Town!',
    description: "Discover what's hot with users within 2km! Chat anonymously, and filter comments by tags or popularity. Discover what’s trending!",
    link: '/feed',
    buttonText: 'Get Chatting',
  },
  {
    id: 3,
    image: require('../assets/busyStreet.jpg'),
    title: 'Feel FOMO No More!',
    description: "Stuck in work and afraid you're missing out? Our app's for the party people and nightowls! The fun won't start til 6pm!",
    link: '/map',
    buttonText: 'Map your Mood',
  }
];

describe('HomeHero Component', () => {
  test('renders the HomeHero component', () => {
    render(<HomeHero />);
    expect(screen.getByTestId('home-hero')).toBeInTheDocument();
  });

  test('renders all carousel items', () => {
    render(<HomeHero />);
    heroData.forEach(hero => {
      expect(screen.getByAltText(`Slide${hero.id}`)).toBeInTheDocument();
      expect(screen.getByText(hero.title)).toBeInTheDocument();
      expect(screen.getByText(hero.description)).toBeInTheDocument();
      // Handle multiple buttons with the same text
      const buttons = screen.getAllByText(hero.buttonText);
      expect(buttons).toHaveLength(heroData.filter(item => item.buttonText === hero.buttonText).length);
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  test('buttons have correct links and text', () => {
    render(<HomeHero />);
    heroData.forEach(hero => {
      // Handle multiple buttons with the same text
      const buttons = screen.getAllByText(hero.buttonText);
      buttons.forEach(button => {
        const anchor = button.closest('a');
        expect(anchor).toHaveAttribute('href', hero.link);
      });
    });
  });

  test('carousel images are rendered correctly', () => {
    render(<HomeHero />);
    heroData.forEach(hero => {
      const image = screen.getByAltText(`Slide${hero.id}`);
      expect(image).toHaveAttribute('src', hero.image);
    });
  });
});