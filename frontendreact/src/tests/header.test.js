// Imports
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react'; // Import act and fireEvent from testing-library/react
import '@testing-library/jest-dom';
import Header from '../components/header';

describe('Header Component', () => {
  test('renders FOMO Navbar with correct links', () => {
    render(<Header />);

    // Verify Navbar Brand (FOMO)
    const brandElement = screen.getByText(/FOMO/i);
    expect(brandElement).toBeInTheDocument();

    // Verify Navbar Links
    const homeLink = screen.getByText(/Home/i);
    expect(homeLink).toBeInTheDocument();

    const mapLink = screen.getByText(/Map/i);
    expect(mapLink).toBeInTheDocument();

    const feedLink = screen.getByText(/Feeds/i);
    expect(feedLink).toBeInTheDocument();

    const notificationLink = screen.getByText(/Notifications/i);
    expect(notificationLink).toBeInTheDocument();
  });

  test('navbar toggle works correctly', () => {
    render(<Header />);

    // Verify Navbar Toggle Button
    const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
    expect(toggleButton).toBeInTheDocument();

    // Click on the toggle button
    act(() => {
      toggleButton.click();
    });

    // Verify if the nav links are visible after toggling
    const homeLink = screen.getByText(/Home/i);
    expect(homeLink).toBeVisible();

    const mapLink = screen.getByText(/Map/i);
    expect(mapLink).toBeVisible();

    const feedLink = screen.getByText(/Feeds/i);
    expect(feedLink).toBeVisible();

    const notificationLink = screen.getByText(/Notifications/i);
    expect(notificationLink).toBeVisible();
  });
});
