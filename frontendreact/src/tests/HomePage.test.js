import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../pages/HomePage';

// Mock the HomeHero, Features, and Try components
jest.mock('../components/landing/homeHero', () => () => <div data-testid="home-hero">Welcome to the Home Page</div>);
jest.mock('../components/landing/features', () => () => <div data-testid="features">These are the features</div>);
jest.mock('../components/landing/tryIt', () => () => <div data-testid="try-it">Try it out now</div>);

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

  it('renders the Features component', () => {
    const featuresElement = screen.getByTestId('features');
    expect(featuresElement).toBeInTheDocument();
    expect(featuresElement).toHaveTextContent(/These are the features/i);
  });

  it('renders the Try component', () => {
    const tryElement = screen.getByTestId('try-it');
    expect(tryElement).toBeInTheDocument();
    expect(tryElement).toHaveTextContent(/Try it out now/i);
  });
});
