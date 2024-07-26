// Header.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../components/Header';

describe('Header Component', () => {
  // Test if the Header component renders correctly
  test('renders the Header component', () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    // Check if the component is in the document
    expect(screen.getByText('FOMO')).toBeInTheDocument();
  });

  // Test if the navigation links are present
  test('contains navigation links', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    // Check if the Home link is present
    expect(screen.getByText('Home')).toBeInTheDocument();
    // Check if the Map link is present
    expect(screen.getByText('Map')).toBeInTheDocument();
    // Check if the Message Board link is present
    expect(screen.getByText('Message Board')).toBeInTheDocument();
  });

  // Test if the Navbar.Toggle is present
  test('contains Navbar.Toggle', () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    // Check if the Navbar.Toggle component is present
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
