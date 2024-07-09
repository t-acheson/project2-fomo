import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../pages/HomePage';
import HomeHero from '../components/homeHero';
import About from '../components/aboutUs';

// Mock the HomeHero and About components if necessary
jest.mock('../components/homeHero', () => () => <div data-testid="home-hero">Welcome to the Home Page</div>);
jest.mock('../components/aboutUs', () => () => <div data-testid="about-us">This is the about section</div>);

describe('HomePage', () => {
  beforeEach(() => {
    render(<HomePage />);
  });

  it('renders without crashing', () => {
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });

  it('renders the HomeHero component', () => {
    const homeHeroElement = screen.getByTestId('home-hero');
    expect(homeHeroElement).toBeInTheDocument();
    expect(homeHeroElement).toHaveTextContent(/Welcome to the Home Page/i);
  });

  it('renders the About component', () => {
    const aboutElement = screen.getByTestId('about-us');
    expect(aboutElement).toBeInTheDocument();
    expect(aboutElement).toHaveTextContent(/This is the about section/i);
  });
});
